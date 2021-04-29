const fs = require('fs');
const util = require('util');
const crypto = require('crypto');
const scrypt = util.promisify(crypto.scrypt)
const Repository = require('./repository')
// const crypto = require('crypto');


class UsersRepository extends Repository {
    async create(attrs) {
        // attrs === {email: '', password: ''}
        attrs.id = this.randomId();

        const salt = crypto.randomBytes(8).toString('hex');
        const buf = await scrypt(attrs.password, salt, 64);

        // SubtleCrypto(attrs.password, salt, 64, (err, buff) =>{
        //     const hashed = buff.toString('hex')
        // })

        const records = await this.getAll();
        const record = {
            ...attrs,
            password: `${buf.toString('hex')}.${salt}`
        };

        records.push(record);

        await this.writeAll(records);

        return record;
    }

    async comparePasswords(saved, supplied) {
        //Saved --> password saved in our database 'hashed.salt
        //supplied -> password given to us by a user trying to sign in

        const [hashed, salt] = saved.split('.');
        const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

        return hashed === hashedSuppliedBuf.toString('hex');
            }
}

module.exports = new UsersRepository('users.json');

//ANOTHER FILE...
// const UsersRepository = require('./users')
// const repo = new UsersRepository('users.json')

