export class Validate {
    static isValidPhoneNumber(phoneNumber: string): boolean {
        const phoneRegex = /^(0[3-9])+([0-9]{8})\b/; // Regex kiểm tra số điện thoại VN
        return phoneRegex.test(phoneNumber);
    }

    static isValidName(name: string): boolean {
        const nameRegex = /^[a-zA-ZàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵĐđ]+(\s[a-zA-ZàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵĐđ]+)+$/;
        return nameRegex.test(name.trim());
    }

    static isValidPassword(password: string): boolean {
        const passwordRegex = /^.{6,}$/;
        return passwordRegex.test(password);
    }

    static isMatchingPassword(password: string, confirmPassword: string): boolean {
        return password === confirmPassword;
    }

    static checkTime(time: Date): string {
        const hour = time.getHours();

        if (hour >= 0 && hour < 12) {
            return "CHÀO BUỔI SÁNG, KATIES";
        } else if (hour >= 12 && hour < 18) {
            return "CHÀO BUỔI CHIỀU, KATIES";
        }
        return "CHÀO BUỔI TỐI, KATIES";
    }
}