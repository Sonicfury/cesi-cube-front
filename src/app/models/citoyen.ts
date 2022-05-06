export interface CitoyenInterface {
  lastname: string,
  firstname: string,
  birthdate: Date,
  address1: string,
  zipCode: string,
  city: string,
  primaryPhone: string,
  address2?: string,
  secondaryPhone?: string,
}
export class Citoyen implements CitoyenInterface {

  constructor(
    public id: number,
    public userId: number,
    public lastname: string,
    public firstname: string,
    public birthdate: Date,
    public address1: string,
    public zipCode: string,
    public city: string,
    public primaryPhone: string,
    public disabledAt: Date,
    public secondaryPhone?: string,
    public address2?: string
  ) {
  }
}
