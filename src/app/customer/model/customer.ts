export interface Address {
  type: number;
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

// TODO
export type CustomerType = 'business' | 'individual';


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
  // Addresses
  // addresses: Address[];

  // Main contact
  department = '';
  person = '';
  phone = '';
  email = '';
  // Contacts
  // contacts: Contact[];
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
