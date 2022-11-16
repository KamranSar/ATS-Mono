<template>
  <v-card flat class="mb-12">
    <v-card-title class="blue-grey lighten-4">
      <v-row>
        <v-col cols="4" xs="12" md="4" class="py-1" align-self="center">
          <h2>Destinations (Non-Institution)</h2>
        </v-col>
        <v-col align="right" align-self="center">
          <BackToHome />
        </v-col>
      </v-row>
    </v-card-title>
    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      color="primary"
    ></v-progress-linear>
    <v-card flat class="ma-4">
      <v-data-table
        :headers="headers"
        :items="destinations"
        sort-by="institutionId"
        class="elevation-1 pa-2"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Destination</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-col cols="2" sm="4" lg="2" align-self="baseline">
              <v-text-field
                v-model="editedItem.institutionId"
                label="Id"
                :rules="[isAvailable || availableText]"
                @input="destIdExists"
              ></v-text-field>
            </v-col>
            <v-col cols="2" sm="4" lg="2" align-self="baseline">
              <v-text-field
                v-model="editedItem.institutionName"
                label="Name"
              ></v-text-field>
            </v-col>
            <v-col cols="2" sm="4" lg="2" align-self="baseline">
              <v-btn
                color="secondary"
                class="mb-2"
                dark
                @click="saveDestination"
              >
                <v-icon>mdi-content-save-outline</v-icon>
                Save
              </v-btn>
            </v-col>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-card>
</template>

<script>
  import BackToHome from '@/components/util/BackToHome.vue';
  import { get, sync, call } from 'vuex-pathify';

  export default {
    components: {
      BackToHome,
    },
    data: () => ({
      isAvailable: true,
      availableText: '',
      loading: false,
      headers: [
        {
          text: 'Id',
          align: 'start',
          sortable: true,
          value: 'institutionId',
        },
        { text: 'Name', value: 'institutionName' },
        { text: 'Edit/Delete', value: 'actions' },
      ],
      editedIndex: -1,
      editedItem: {
        institutionId: '',
        institutionName: '',
      },
      defaultItem: {
        institutionId: '',
        institutionName: '',
      },
    }),
    computed: {
      ...get('users', ['loggedInUser']),
      ...get('institutions', ['listOfInstitutions']),
      ...sync('destinations', ['destinations']),
    },

    watch: {},
    methods: {
      ...call('app', ['SET_SNACKBAR']),
      ...call('destinations', [
        'createDestination',
        'readDestinations',
        'updateDestination',
        'deleteDestination',
      ]),
      goHome() {
        this.$router.push({
          name: 'Home',
        });
      },
      setSnackbar(msg, result, timeout) {
        this.SET_SNACKBAR({
          top: true,
          center: true,
          message: msg,
          color: result,
          timeout: timeout,
        });
      },
      editItem(item) {
        // console.log('editItem(): item', item);
        this.editedIndex = this.destinations.indexOf(item);
        this.editedItem = Object.assign({}, item);
        // console.log('editItem(): this.editedItem', this.editedItem);
      },
      async destinationDelete(id) {
        if (id) {
          try {
            await this.deleteDestination(id);
            this.setSnackbar(
              'Successfully deleted destination!',
              'success',
              3000
            );
          } catch (ex) {
            console.error(ex);
            this.setSnackbar(`Failed to delete destination!`, 'error', 3000);
            return false;
          }
        } else {
          this.setSnackbar('Cannot remove destination. id = ', id);
          return false;
        }

        return true;
      },
      async deleteItem(item) {
        const index = this.destinations.indexOf(item);

        let res = confirm('Are you sure you want to delete this destination?');
        if (res) {
          res = this.destinationDelete(item._id);
          if (res) {
            this.destinations.splice(index, 1);
            if (this.editedItem._id === item._id) {
              this.editedItem = {};
            }
          }
        }
      },
      async saveDestination() {
        if (
          !this.editedItem.institutionId ||
          !this.editedItem.institutionName
        ) {
          this.setSnackbar(
            `ERROR! Please enter the Id and Name of the destination and try again.`,
            'error',
            3000
          );
          return;
        }
        if (this.destIdExists()) {
          this.setSnackbar(
            `ERROR! The destination you entered already exists.`,
            'error',
            3000
          );
          return;
        }

        try {
          let response = [];
          // console.log('saveDestination(): this.editedItem => ', this.editedItem);
          if (this.editedItem._id) {
            // Update Destination
            response = await this.updateDestination(this.editedItem);
            // console.log('saveDestination(): updateDestination(): response => ', response);
            if (response) {
              Object.assign(this.destinations[this.editedIndex], response);
            } else {
              this.setSnackbar(
                `ERROR! Could not update destination.`,
                'error',
                3000
              );
              console.log(
                'saveDestination(): updateDestination(): response => ',
                response
              );
            }
          } else {
            // Create Destination
            // console.log('saveDestination(): createdestination(): checking for duplicate');
            for (let r of this.destinations) {
              if (r.institutionId === this.editedItem.institutionId) {
                this.setSnackbar(
                  `Duplicate Destination Id: ${this.editedItem.institutionId}`,
                  'error',
                  3000
                );
                console.log(
                  `saveDestination(): createDestination(): duplicate found: ${this.editedItem.institutionId}.`
                );
                return;
              }
            }
            response = await this.createDestination(this.editedItem);
            // console.log('saveDestination(): createDestination(): response => ', response);
            if (response) {
              this.destinations.push(response);
            } else {
              this.setSnackbar(
                `ERROR! Could not create destination.`,
                'error',
                3000
              );
              console.log(
                'saveDestination(): createDestination(): response => ',
                response
              );
            }
          }

          if (response) {
            this.editedItem = {};
            this.editedIndex = -1;
          }
        } catch (ex) {
          this.setSnackbar(
            `ERROR! Could not create or update destination.`,
            'error',
            3000
          );
          console.error(ex);
        }
      },
      destIdExists() {
        console.log(
          'destIdExists(): this.editedItem.institutionId => ',
          this.editedItem.institutionId
        );
        const item = (this.editedItem.institutionId =
          this.editedItem.institutionId.toUpperCase());
        const res1 = this.listOfInstitutions.find(
          (v) => v.institutionId === item
        );
        const res2 = this.destinations.includes(
          (v) => v.destinastionId === this.editedItem.institutionId
        );
        if (res1 || res2) {
          let val = '';
          if (res1) {
            val = 'institution: ' + res1.institutionName;
          } else {
            val = 'destination: ' + res2.institutionName;
          }
          this.availableText = `${item} in use by ${val}`;
          return !(this.isAvailable = false);
        } else {
          this.availableText = '';
          return !(this.isAvailable = true);
        }
      },
    },
  };
</script>

<style scoped></style>
