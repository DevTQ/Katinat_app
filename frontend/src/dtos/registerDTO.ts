class RegisterComponentDTO {
    phoneNumber: string;
    referralCode?: string;
    name: string;
    gender: "Nam" | "Nữ" | "Khác";
    password: string;
    confirmPassword: string;
  
    constructor(data: Partial<RegisterComponentDTO> = {}) {
      this.phoneNumber = data.phoneNumber || "";
      this.referralCode = data.referralCode || "";
      this.name = data.name || "";
      this.gender = data.gender || "Khác";
      this.password = data.password || "";
      this.confirmPassword = data.confirmPassword || "";
    }
  }
export default RegisterComponentDTO;
  