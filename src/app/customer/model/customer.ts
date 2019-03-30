export interface AddAddress {
  // type?: AddAddressType = other;
  addStreet: string;
  addPostalCode: string;
  addCity: string;
  // country: string;
}

// TODO
export type CustomerType = 'business' | 'individual' | 'other';
export type AddAddressType = 'shipping' | 'billing' | 'other';


export class Customer {
  // Basic Data
  id = 0;
  name = ''; // 'A' || 'B';
  type = 1; // 0 = Business | 1 = Individual // Industry?
  status = 1; // 0 = Active | 1 = Suspended | Pending = 2
  comment = '';
  creationDate = '';

  // Main address
  street = '';
  postalCode = '';
  city = '';
  country = '';

  // Additional Addresses
  addAddresses?: any[];

  // Main contact
  department = '';
  person = '';
  phone = '';
  email = '';

  // Additional Contacts
  // contacts?: Contact[] = [];
}


  // homepage?: string
  // Contacts
  // Bank Accounts
  // Sales Area

  // clear() {
  //   this.name = "";
  //   // this.firstName = '';
  //   // this.lastName = '';
  //   this.type = 0;
  //   this.status = 0;
  //   this.comment = "";
  //   this.creationDate = "";
  //   // Address Data
  //   this.street = "";
  //   this.postalCode = "";
  //   this.city = "";
  //   this.region = "";
  //   this.country = "";
  //   // Communication Data
  //   this.phone = "";
  //   this.email = "";
  // }


// 	dateOfBbirth: string;
// 	dob: Date;
