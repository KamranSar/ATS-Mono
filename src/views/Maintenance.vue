<template>
  <v-card flat class="mb-12">
    <v-card-title class="blue-grey lighten-4">
      <v-row>
        <v-col cols="4" xs="12" md="4" class="py-1" align-self="center">
          <h2>Maintenance</h2>
        </v-col>
        <v-col align="right" align-self="center">
          <v-icon small color="primary" right>mdi-arrow-left</v-icon>
          <a @click="goHome" class="text-decoration-none subtitle-2">
            Back to Home
          </a>
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
        :items="reasons"
        sort-by="reasonCode"
        class="elevation-1 pa-2"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Specific Transfer Reasons</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-col cols="2" sm="4" lg="2" align-self="baseline">
              <v-text-field
                v-model="editedItem.reasonCode"
                label="Code"
              ></v-text-field>
            </v-col>
            <v-col cols="2" sm="4" lg="2" align-self="baseline">
              <v-text-field
                v-model="editedItem.reasonDesc"
                label="Description"
              ></v-text-field>
            </v-col>
            <v-col cols="2" sm="4" lg="2" align-self="baseline">
              <v-btn color="secondary" class="mb-2" dark @click="saveReason">
                <v-icon>mdi-content-saveReason-outline</v-icon>
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
  import { get, sync, call } from 'vuex-pathify';

  export default {
    data: () => ({
      loading: false,
      headers: [
        {
          text: 'Code',
          align: 'start',
          sortable: true,
          value: 'reasonCode',
        },
        { text: 'Description', value: 'reasonDesc' },
        { text: 'Edit/Delete', value: 'actions' },
      ],
      editedIndex: -1,
      editedItem: {
        id: '',
        reasonCode: '',
        reasonDesc: '',
      },
      defaultItem: {
        id: '',
        reasonCode: '',
        reasonDesc: '',
      },
    }),
    computed: {
      ...get('users', ['loggedInUser']),
      ...sync('reasons', ['reasons']),
    },

    watch: {
      dialogDelete(val) {
        val || this.closeDelete();
      },
    },
    methods: {
      ...call('app', ['SET_SNACKBAR']),
      ...call('reasons', [
        'createReason',
        'readReasons',
        'updateReason',
        'deleteReason',
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
        this.editedIndex = this.reasons.indexOf(item);
        this.editedItem = Object.assign({}, item);
        // console.log('editItem(): this.editedItem', this.editedItem);
      },
      async reasonDelete(id) {
        if (id) {
          try {
            await this.deleteReason(id);
            this.setSnackbar('Successfully deleted reason!', 'success', 3000);
          } catch (ex) {
            console.error(ex);
            this.setSnackbar(`Failed to delete reason!`, 'error', 3000);
            return false;
          }
        } else {
          this.setSnackbar('Cannot remove reason. id = ', id);
          return false;
        }

        return true;
      },
      async deleteItem(item) {
        const index = this.reasons.indexOf(item);

        let res = confirm('Are you sure you want to delete this reason?');
        if (res) {
          res = this.reasonDelete(item._id);
          if (res) {
            this.reasons.splice(index, 1);
            if (this.editedItem._id === item._id) {
              this.editedItem = {};
            }
          }
        }
      },
      async saveReason() {
        try {
          let response = [];
          // console.log('saveReason(): this.editedItem => ', this.editedItem);
          if (this.editedItem._id) {
            // Update Reason
            response = await this.updateReason(this.editedItem);
            // console.log('saveReason(): updateReason(): response => ', response);
            if (response) {
              Object.assign(this.reasons[this.editedIndex], response);
            } else {
              this.setSnackbar(
                `ERROR! Could not update reason.`,
                'error',
                3000
              );
              console.log(
                'saveReason(): updateReason(): response => ',
                response
              );
            }
          } else {
            // Create Reason
            // console.log('saveReason(): createReason(): checking for duplicate');
            for (let r of this.reasons) {
              if (r.reasonCode === this.editedItem.reasonCode) {
                this.setSnackbar(
                  `Duplicate code: ${this.editedItem.reasonCode}`,
                  'error',
                  3000
                );
                console.log('saveReason(): createReason(): duplicate found');
                return;
              }
            }
            response = await this.createReason(this.editedItem);
            // console.log('saveReason(): createReason(): response => ', response);
            if (response) {
              this.reasons.push(response);
            } else {
              this.setSnackbar(
                `ERROR! Could not create reason.`,
                'error',
                3000
              );
              console.log(
                'saveReason(): createReason(): response => ',
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
            `ERROR! Could not create or update reason.`,
            'error',
            3000
          );
          console.error(ex);
        }
      },
    },
  };
</script>

<style scoped></style>
