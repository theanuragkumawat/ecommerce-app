import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client.setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name, role = 'user' }) {
        try {
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                name,
                role
            );
            if (userAccount) {
                return userAccount;
            }
        } catch (error) {
            throw error
        }
    }

    async login({ email, password }) {
        try {
            const user = await this.account.createEmailPasswordSession(email, password);
            return user
        } catch (error) {
            throw error

        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get()
        } catch (error) {
            console.log("get account error" + error);
            return false
        }
    }

    async logout() {
        try {
            return await this.account.deleteSessions()
        } catch (error) {
            console.log("Logout error" + error);

        }
    }

    // _____________VERIFY____________
    async getVerification() {
        try {
            // return await this.account.createVerification('http://localhost:5173/verify')
            return await this.account.createVerification('https://ecommerce-app-lilac-three.vercel.app/verify')
        } catch (error) {
            console.log("Verify error" + error);
        }
    }

    async updateVerification(userId, secret) {
        try {
            return await this.account.updateVerification(userId, secret);
        } catch (error) {
            throw error
        }
    }

    // Change Password

    async changePassword({ newPassword, oldPassword }) {
        try {
            return await this.account.updatePassword(
                newPassword, // password
                oldPassword // oldPassword (optional)
            );
        } catch (error) {
            console.log("Change password error: " + error);
            throw error
        }
    }

    // Recover------

    async createPasswordRecover({ email }) {
        try {
            console.log(email);
            
            return await this.account.createRecovery(
                email,
                'https://ecommerce-app-lilac-three.vercel.app/recover'
                // 'http://localhost:5173/recover'
            );
        } catch (error) {
            console.log("createPasswordRecover: " + error);
            throw error
        }
    }
    async updatePasswordRecover({ password }, userId, secret) {
        try {
            return await this.account.updateRecovery(
                userId,
                secret,
                password
            );
        } catch (error) {
            console.log("updatePasswordRecover error: " + error);
            throw error
        }
    }

}


const authService = new AuthService();

export default authService;


