<template>
  <v-alert
    v-if="!!oldestError"
    v-model="showError"
    transition="scale-transition"
    type="error"
    style="z-index: 101"
  >
    <v-row align="center" no-gutters>
      <v-col>
        <h3 class="headline">A Problem Occurred!</h3>
      </v-col>
      <v-col cols="auto">
        <v-btn icon @click="showError = false">
          <v-icon v-text="'fas fa-times-circle'" />
        </v-btn>
      </v-col>
    </v-row>

    <v-row align="center" no-gutters>
      <v-col>
        {{ oldestError.message }}
      </v-col>
      <v-col cols="auto">
        <v-btn text @click="details = !details">
          {{ details ? 'Summary' : 'Details' }}
        </v-btn>
      </v-col>
    </v-row>
    <v-card v-if="details" class="pa-2" style="background: #ffffff30">
      <p>
        {{ oldestError.timestamp }} -- Type: {{ label }}
        {{ oldestError.vueErr ? ' / Vue' : '' }}
        {{ oldestError.unhandled ? ' / Unhandled' : '' }}
        {{ oldestError.generic ? ' / Generic' : '' }}
        <span v-if="oldestError.vueErr">
          <span v-if="oldestError.vueErr.info">
            , Info: {{ oldestError.vueErr.info }}</span
          >
        </span>
        <span v-if="oldestError.generic">
          <span v-if="oldestError.generic.source">
            , Source: {{ oldestError.generic.source }}</span
          >
          <span v-if="oldestError.generic.lineno">
            , Line: {{ oldestError.generic.lineno }}</span
          >
          <span v-if="oldestError.generic.colno">
            , Column: {{ oldestError.generic.colno }}</span
          >
          <span v-if="oldestError.generic.error">
            , Other: {{ oldestError.generic.error }}</span
          >
        </span>
      </p>
      <p v-if="oldestError.stack">
        <DataStores ref="datastores" inCatch />
        <v-btn text @click="stack = !stack">
          {{ stack ? 'Hide Stack' : 'Show Stack' }}
        </v-btn>
        <v-card v-if="stack" style="background: #ffffff30">
          <span style="white-space: pre-wrap">{{ oldestError.stack }}</span>
        </v-card>
      </p>
    </v-card>
  </v-alert>
  <div v-else>
    <slot />
  </div>
</template>

<script>
  /* Error handling hook only works on children, not on this component's logic
   * Put all logic in child components
   *
   * https://itnext.io/error-handling-with-async-await-in-js-26c3f20bc06a
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
   *
   * General guidance:
   * 1) only create new Promise when the logic is completed via callback, such as
   *    setTimeout or file onload. Otherwise, declaring a function async will
   *    automatically wrap return in Promise.resolve and throw error in Promise.reject.
   * 2) only use async/await, not .then() .catch()
   * 3) only wrap in try/catch blocks if you are doing something meaningful with the error
   * 4) always catch a recoverable error in the business layer to avoid this Catch
   *    component from being triggered. This component is really meant for fatal errors.
   */
  import { addListener, removeListeners } from '@cdcr/helpers';
  import { getNowAsTS, formatDateTime } from '@cdcr/helpers/dateTime.js';

  export default {
    name: 'Catch',
    props: {
      label: { type: String, required: false },
    },
    data: () => ({
      errors: {},
      details: false,
      stack: false,
    }),
    created() {
      if (window) {
        console.groupCollapsed('Registering onerror and unhandledrejection');
        console.log('Intentionally left empty');
        console.groupEnd();
        let self = this;
        addListener(this, {
          name: 'unhandledrejection',
          callback: (event) => {
            self.onError({ unhandled: event });
            // don't call event.preventDefault() here so we can see stack trace in console log
          },
        });

        addListener(this, {
          name: 'onerror',
          callback: (message, source, lineno, colno, error) => {
            self.onError({
              generic: {
                message,
                source,
                lineno,
                colno,
                error,
              },
            });
          },
        });
      }
    },
    computed: {
      showError: {
        get() {
          return !!this.oldestError;
        },
        set(value) {
          if (!value) this.deleteOldest();
        },
      },
      errorCount() {
        return Object.keys(this.errors).length; // TODO: add way to show total # errors, and clear all errors
      },
      oldestError() {
        let error;
        let ids = Object.keys(this.errors);
        if (ids.length > 0) {
          ids.sort();
          let id = ids[0];
          error = {
            count: ids.length,
            ...this.errors[id],
          };
        }
        return error;
      },
    },
    errorCaptured(err, vm, info) {
      return this.onError({ vueErr: { err, vm, info } });
    },
    beforeDestroy() {
      removeListeners(this);
    },
    methods: {
      onError({ vueErr, unhandled, generic }) {
        let id = getNowAsTS();
        let err = vueErr ? vueErr.err : unhandled ? unhandled.reason : generic;
        let code = err ? err.code : null;
        let message = err ? err.message : 'unknown error';
        let stack = err ? err.stack : null;

        let error = {
          id,
          code,
          message,
          stack,
          err,
          vueErr,
          unhandled,
          generic,
          timestamp: formatDateTime(),
        };
        if (!this.myApp.hooks.onError({ error })) {
          // if app doesn't handle the error, do it here...
          // first, check for off-line
          if (error.code === 'off-line') {
            this.$store.dispatch('setSnackbar', {
              text: 'Please try again when device is on-line',
            });
          } else {
            // last, handle all other errors by logging and displaying
            console.error(`Error Caught: ${message}`, error);

            // see if we should ignore the error
            if (
              message &&
              message.toLowerCase().includes('failed to update a serviceworker')
            ) {
              error = null;
            }

            // add to collection for display to user
            if (error) this.$set(this.errors, id, error);
          }
        }
        return false; // don't propagate
      },
      deleteOldest() {
        if (this.oldestError) {
          this.details = false;
          this.stack = false;
          this.$delete(this.errors, this.oldestError.id);
        }
      },
    },
  };
</script>
