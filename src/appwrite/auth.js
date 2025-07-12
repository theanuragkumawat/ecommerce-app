import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client.setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, username, role = 'user' }) {
        try {
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                username,
                role
            );
            if (userAccount) {
                return userAccount;
            }
        } catch (error) {
            throw error
        }
    }

    async login({email,password}){
        try {
            const user = await this.account.createEmailPasswordSession(email,password);
            return user
        } catch (error) {
            throw error
            
        }
    }

    async getCurrentUser(){
        try {
            return await this.account.get()
        } catch (error) {
            console.log("get account error" + error);
            
        }
    }

    async logout(){
        try {
            return await this.account.deleteSessions()
        } catch (error) {   
            console.log("Logout error" + error);
            
        }
    }
}


const authService = new AuthService();

export default authService;