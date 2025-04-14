class LoginDTO {
  id?: number;
  phone_number: string;
  password: string;
  fullname: string;

  constructor(data: Partial<LoginDTO> = {}) {
      this.id = data.id;
      this.phone_number = data.phone_number || "";
      this.password = data.password || "";
      this.fullname = data.fullname || "";
  }
}

export default LoginDTO;
