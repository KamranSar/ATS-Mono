<template>
  <v-row>
    <v-col>
      <div>
        <v-data-table
          v-model="editedHoldItem"
          :items-per-page="itemsPerPage"
          dense
          :headers="holdsHeader"
          :items="holds"
          class="elevation-1"
          @keypress="filterHolds"
          no-data-text="No Holds"
          no-results-text="No Holds Found"
        >
          <span style="color: rgba(0, 0, 0, 0.6); font-size: 14px">
            Holds
          </span>
          <template> </template>
          <!-- <template v-slot:top class="pb-4" style="boder: 1px solid lightgray">
            <span style="color: rgba(0, 0, 0, 0.6); font-size: 14px">
              Holds
            </span>
            <v-dialog v-model="dlgEditHold" max-width="400px">
              <template v-slot:activator="{ on, attrs }">
                <button
                  type="button"
                  style="
                    background-color: #1976d2;
                    border-radius: 4px;
                    float: right;
                    margin-top: -2px;
                  "
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon dark dense>mdi-plus</v-icon>
                </button>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitleHold }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col>
                        <v-text-field
                          v-model="editedHoldItem.effectiveDate"
                          label="Effective Date"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          v-model="editedHoldItem.holdType"
                          label="Reason/Hold Type"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          v-model="editedHoldItem.expirationDate"
                          label="Expiration Date"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field
                          v-model="editedHoldItem.comments"
                          label="Comments"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-2" text @click="cancelHold">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-2" text @click="saveHold">
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dlgDeleteHold" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">
                  Are you sure you want to delete this item?
                </v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="cancelDeleteHold">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="confirmDeleteHold">
                    OK
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-divider class="pb-4"></v-divider>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editHoldItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteHoldItem(item)"> mdi-delete </v-icon>
          </template> -->
        </v-data-table>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    name: 'TransferHoldsTable',
    data: () => ({
      dlgDeleteHold: false,
      dlgEditHold: false,
      itemsPerPage: 5,
      editHoldTitle: '',
      editedHoldIndex: -1,
      editedHoldItem: {
        number: 0,
        reason: '',
        date: '',
        comments: '',
      },
      defaultHoldItem: {
        number: 0,
        reason: '',
        date: '',
        comments: '',
      },
      editedCaseFactorIndex: -1,
      editedCaseFactorItem: {
        code: 0,
      },
      // Holds Table Header
      holdsHeader: [
        // { text: 'Number', value: 'number' },
        { text: 'Date', value: 'effectiveDate' },
        { text: 'Reason', value: 'holdType' },
        { text: 'Exp. Date', value: 'expirationDate' },
        { text: 'Comments', value: 'comments' },
        // { text: 'Actions', value: 'actions', sortable: false },
      ],
      holds: [],
    }),
    computed: {
      // formTitleCF() {
      //   return this.editedCaseFactorIndex === -1
      //     ? 'New Case Factor'
      //     : 'Edit Case Factor';
      // },
      formTitleHold() {
        return this.editedHoldIndex === -1 ? 'New Hold' : 'Edit Hold';
      },
    },
    methods: {
      // Hold Methods
      // filterHolds() {},
      // cancelHold() {
      //   this.dlgEditHold = false;
      //   this.$nextTick(() => {
      //     this.editedHoldItem = Object.assign({}, this.defaultHoldItem);
      //     this.editedHoldIndex = -1;
      //   });
      // },
      // saveHold() {
      //   if (this.editedHoldIndex > -1) {
      //     Object.assign(this.holds[this.editedHoldIndex], this.editedHoldItem);
      //   } else {
      //     this.holds.push(this.editedHoldItem);
      //   }
      //   this.cancelHold();
      // },
      // deleteHoldItem(item) {
      //   this.editedHoldIndex = this.caseFactors.indexOf(item);
      //   this.editedHoldItem = Object.assign({}, item);
      //   this.dlgDeleteHold = true;
      // },
      // cancelDeleteHold() {
      //   this.dlgDeleteHold = false;
      //   this.$nextTick(() => {
      //     this.editedHoldItem = Object.assign({}, this.defaultHoldItem);
      //     this.editedHoldIndex = -1;
      //   });
      // },
      // confirmDeleteHold() {
      //   this.holds.splice(this.editedHoldIndex, 1);
      //   this.cancelDeleteCaseFactor();
      // },
      // cancelDeleteCaseFactor() {
      //   this.dlgDeleteCF = false;
      //   this.$nextTick(() => {
      //     this.editedCaseFactorItem = Object.assign({}, this.defaultItem);
      //     this.editedCaseFactorIndex = -1;
      //   });
      // },
      // editHoldItem(item) {
      //   this.editedHoldIndex = this.holds.indexOf(item);
      //   this.editedHoldItem = Object.assign({}, item);
      //   this.dlgEditHold = true;
      // },
    },
  };
</script>
