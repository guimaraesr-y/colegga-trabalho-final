import bcrypt from "bcrypt";

export default class BCrypt {
    
    private static saltRounds = 11;

    static hash(password: string) {
        const salt = bcrypt.genSaltSync(this.saltRounds);
        return bcrypt.hashSync(password, salt);
    }

    static compare(password: string, hash: string) {
        return bcrypt.compareSync(password, hash);
    }
    
}
