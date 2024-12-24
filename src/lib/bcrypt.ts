import bcrypt from "bcrypt";

export default class BCrypt {
    
    private static saltRounds = 11;

    static async hash(password: string): Promise<string> {
        const salt = bcrypt.genSaltSync(this.saltRounds);
        return bcrypt.hashSync(password, salt);
    }

    static async compare(password: string, hash: string) {
        const result = bcrypt.compareSync(password, hash);
        return result;
    }
    
}
