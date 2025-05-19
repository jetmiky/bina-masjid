$(document).ready(() => {
    window.validation = {
        isStringEmpty,
        isValidEmail,
        isValidPassword,
        isPasswordMatch,
        isValidPhone,
        isValidPostalCode,
    };

    function isStringEmpty(string) {
        return !String(string).trim().length;
    }

    function isValidEmail(email) {
        if (typeof email !== "string") {
            return false;
        }

        if (email.includes(" ")) {
            return false;
        }

        const atIndex = email.indexOf("@");
        if (atIndex < 1) {
            return false;
        }

        const dotIndex = email.lastIndexOf(".");
        if (dotIndex <= atIndex + 1 || dotIndex === email.length - 1) {
            return false;
        }

        if (email.indexOf("@", atIndex + 1) !== -1) {
            return false;
        }

        return true;
    }

    function isValidPassword(password) {
        return password.length >= 8;
    }

    function isPasswordMatch(password, confirmPassword) {
        return password === confirmPassword;
    }

    function isValidPhone(phone) {
        return phone.startsWith("08") && phone.length >= 10;
    }

    function isValidPostalCode(postal) {
        return (
            Number.parseInt(postal) >= 10000 &&
            Number.parseInt(postal) <= 99999 &&
            String(postal).length === 5
        );
    }
});
