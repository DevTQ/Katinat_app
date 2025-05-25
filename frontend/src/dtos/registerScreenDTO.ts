class RegisterScreenDTO {
  phoneNumber: string;
  referralCode?: string;

  constructor(data?: Partial<RegisterScreenDTO>) {
      this.phoneNumber = data?.phoneNumber || "";
      this.referralCode = data?.referralCode || "";
  }
}

export default RegisterScreenDTO;