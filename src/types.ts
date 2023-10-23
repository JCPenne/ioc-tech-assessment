export interface UserDataObject {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  city: string;
  registered_date: string;
  is_private: boolean;
}

export type User = {
  email?: string;
  columnOrder?: string[];
};
