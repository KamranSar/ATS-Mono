<template>
<div>
 <v-card >
  <!-- <div>
    <h1>Offender Transfer</h1>
  </div> -->

      <v-card-title class="blue-grey lighten-4">
        <v-row>
          <v-col cols="6">
            <span>Offender Transfer</span>
          </v-col>
          <v-col cols="6">
            <v-row class="pt-4 mr-3" justify="end"
              ><v-icon small color="primary" right>mdi-arrow-left</v-icon>
              <a @click="cancelCreate" class="text-decoration-none subtitle-2">Back to Dashboard</a>
            </v-row>
          </v-col>
        </v-row>
      </v-card-title>
      
<v-divider></v-divider>
 <v-divider class="pb-2"></v-divider>
  <v-row>

                 <v-col cols="4" sm="6" md="3" lg="3"
              ><v-img height="100%" class="white--text" :src="displayPhoto" contain>
                <!-- <v-img max-height="400px" contain :src="displayPhoto"> -->
                <template v-slot:placeholder>
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                   
                </template>
              </v-img>
              <span class="labeling">CDCR Number:</span>
               <span class="labeling">AA1234</span>
            </v-col>
            <v-col class="py-0 my-0" cols="8" sm="6" md="4" lg="3">
               <span class="labeling">Last Name:</span>
               <span class="labeling">Last TestName</span>
               <br/>
               <span class="labeling">First Name:</span>
               <br/>
               <span class="labeling">Ethnicity:</span>
               <br/>
               <span class="labeling">Housing:</span>
               <br/>
               <span class="labeling">Arrival Date:</span>
               <br/>
               <span class="labeling">TB Code:</span>
               <br/>
               <span class="labeling">Release Date:</span>
               <br/>
               <span class="labeling">Release Type:</span>
              
            </v-col>

           

            <v-col sm="12" md="5" lg="6">
               <span class="labeling">Endorsed To/Security Level: </span>
               <span class="labeling">Security level test</span>
               <br/>
               <span class="labeling">Original Endorsement Date: </span>
               <br/>
               <span class="labeling">Current Endorsement Date: </span>
               <br/>
               <span class="labeling">Expiration Date: </span>
               <br/>
               <span class="labeling">Housing Restrictions: </span>
               <br/>
               <span class="labeling">Physical Limitations: </span>
               <br/>
               <span class="labeling">Override Reason: </span>
               <span class="labeling">Override testing reason</span>
               <br/>
               <span class="labeling">Mental Health:</span>
            </v-col>

  <v-col sm="12" md="5" lg="6">
     
  </v-col>
        
 </v-row>
  
 </v-card>

 <v-divider class="pb-2"></v-divider>
<v-card>
<v-row class="mt-2">

  <v-col cols="3">
 
            <v-text-field
            dense
              label="Hold Date"
              prepend-icon="mdi-calendar"
              v-bind="attrs"
              v-on="on"
              placeholder=""
            ></v-text-field>
        

  </v-col>
           <v-col cols ="4">
       <!-- <v-combobox
                    dense :items="holdReasonList" 
                   v-model="editedItem.holdReason"  
                      label="Hold Reason"
                      placeholder=" ">
                    </v-combobox> -->
                    <v-combobox
                      dense 
                      label="Hold Reason"
                      placeholder=" " >
                    </v-combobox> 
          </v-col>
                  <v-col cols="4">
                    <!-- <v-text-field
                    dense
                      v-model="editedItem.holdComments"
                      label="Hold Comments"
                      placeholder=" "
                    ></v-text-field> -->
                    <v-text-field
                    dense
                      label="Hold Comments"
                      placeholder=" "
                    ></v-text-field>

                  </v-col>

</v-row>
</v-card>


    <!-- <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions> -->
      <!-- <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog> -->

 <v-card>          
<v-row class="px-3" no-gutters>
        <v-col class="py-0 my-0" cols="10" sm="6" md="4" lg="3">
                  <v-combobox
            label="Destination"
            placeholder=" "
          ></v-combobox>
               <br/>
                  <v-combobox
            label="Schedule"
            placeholder=" "
          ></v-combobox>
              
               <br/>
               <v-combobox
          dense
            label="VIA1"
            placeholder=" "
          ></v-combobox>
               <br/>
                <v-combobox
          dense
            label="VIA2"
            placeholder=" "
          ></v-combobox>
               <br/>
                  <v-text-field
              label="Transfer Date"
              prepend-icon="mdi-calendar"
              v-bind="attrs"
              v-on="on"
              placeholder=" "
            ></v-text-field>
          <!-- <v-date-picker
            v-model="offenderTransfered.transferDate"
            @input="transferDateMenu = false"
          ></v-date-picker> -->
               <br/>
                  <v-text-field
                    dense
                      label="Specific Transfer Reason"
                      placeholder=" "
                    ></v-text-field>
                 
               <br/>
               <br/>
              
            </v-col>
            <v-col cols="6">
                   <v-combobox
        dense
          label="Offender Case Factors"
          placeholder=" "
        ></v-combobox>
            </v-col>
  </v-row>
 </v-card>      
  
        <v-row>
         <!-- <v-col
        cols="4" >
        <v-combobox
        dense
          v-model="offenderTransfered.caseFactors"
          :items="caseFactorsList"
          multiple
          label="Offender Case Factors"
          placeholder=" "
        ></v-combobox> -->

            <!-- <v-combobox
        dense
          label="Offender Case Factors"
          placeholder=" "
        ></v-combobox>
      </v-col> --> 

 <v-col cols="8">

      <v-tabs vertical>
        <v-tab>
          Auditor Comments
        </v-tab>
        <v-tab>
          CDCR 135 Comments
        </v-tab>
        <v-tab>
        In-House Remarks
        </v-tab>
  
        <v-tab-item>
          <v-card>
            <v-card-text>
              <!-- <v-textarea v-model="offenderTransfered.auditorComments" background-color="#eef6ff" dense outlined label="Auditor Comments" readonly placeholder=" " rows="4"></v-textarea>
               -->
               <v-textarea label="Auditor Comments" readonly placeholder=" " rows="4"></v-textarea>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            <v-card-text>
              <!-- <v-textarea v-model="offenderTransfered.cdcr135Comments" dense outlined label="CDCR 135 Comments" placeholder=" " rows="4"></v-textarea> -->
            <v-textarea label="CDCR 135 Comments" placeholder=" " rows="4"></v-textarea>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            <v-card-text>
              <!-- <v-textarea v-model="offenderTransfered.inHouseRemarks" dense outlined label="In-House Remarks" placeholder=" " rows="4"></v-textarea> -->
            <v-textarea label="In-House Remarks" placeholder=" " rows="4"></v-textarea>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-col>
  </v-row>
            
</div>
</template>
