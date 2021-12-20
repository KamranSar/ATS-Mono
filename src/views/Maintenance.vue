<template>
  <div>
    <v-card elevation="3" class="ma-4 px-4 pb-4">
      <h1>ATS Maintenance</h1>
      <v-data-table
        :headers="headers"
        :items="reasons"
        sort-by="reasonCode"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Transfer Reason</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="secondary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  New Transfer Reason
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.reasonCode"
                          label="Code"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.reasonDesc"
                          label="Description"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline">
                  Are you sure you want to delete this item?
                </v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">
                    OK
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize"> Reset </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
  import { sync, call } from 'vuex-pathify';

  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
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
        reasonCode: '',
        reasonDesc: '',
      },
      defaultItem: {
        reasonCode: '',
        reasonDesc: '',
      },
    }),

    computed: {
      ...sync('reasons', ['reasons']),
      formTitle() {
        return this.editedItem._id ? 'New Item' : 'Edit Item';
      },
    },

    watch: {
      // dialog(val) {
      //   val || this.close();
      // },
      // dialogDelete(val) {
      //   val || this.closeDelete();
      // },
    },

    created() {
      this.initialize();
    },

    methods: {
      ...call('reasons', [
        'deleteReason',
        'readReasons',
        'createReason',
        'updateReason',
      ]),
      initialize() {},

      editItem(item) {
        // this.editedIndex = this.reasons.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },

      deleteItem(item) {
        // this.editedIndex = this.reasons.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
      },

      async deleteItemConfirm() {
        // this.reasons.splice(this.editedIndex, 1);
        await this.deleteReason(this.editedItem._id);
        this.editedItem = Object.assign({}, this.defaultItem);
        this.readReasons();
        this.dialogDelete = false;
        // this.closeDelete();
      },

      close() {
        this.dialog = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          // this.editedIndex = -1;
        });
      },

      closeDelete() {
        this.dialogDelete = false;
        // this.$nextTick(() => {
        // this.editedItem = Object.assign({}, this.defaultItem);
        //this.editedIndex = -1;
        // });
      },

      async save() {
        // if (this.editedIndex > -1) {
        if (this.editedItem._id) {
          // Object.assign(this.reasons[this.editedIndex], this.editedItem);
          // Update
          await this.updateReason(this.editedItem);
        } else {
          // Create Reason
          // this.reasons.push(this.editedItem);
          await this.createReason(this.editedItem);
        }
        await this.readReasons();
        this.close();
      },
    },
  };
</script>

<style scoped></style>
