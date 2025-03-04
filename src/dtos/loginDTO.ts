class LoginDTO {
    
    phone_number: string;
    password: string;

    constructor(data: Partial<LoginDTO> = {}) {
        this.phone_number = data.phone_number || "";
        this.password = data.password || "";
      }
}

export default LoginDTO;