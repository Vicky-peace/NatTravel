import sql from 'mssql';
import bcrypt from 'bcrypt';
import config from '../db/config.js';
import jwt from 'jsonwebtoken';

export const loginRequired = (req,res,next) =>{
    if(req.user){
        next();
    } else{
        return res.status(401).json({message:'Unauthorized user!'});
    }
};

// Get all users
export const getAllUsers = async(req,res) =>{
    try{
        let pool = await sql.connect(config.sql);
        let users = await pool.request()
        .query('SELECT id, name, email FROM Users');
        res.status(200).json(users.recordsets[0])
      }catch(error){
    res.status(404).json(error);
      } finally{
        sql.close();
      }
}

// Get one user 
export const getOneUser = async(req,res) =>{
    const {id} = req.params;
     try{
        let pool = await sql.connect(config.sql);
        let user = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM Users WHERE id= @id')
        console.log(user.recordsets[0])
        !user.recordsets[0]? res.status(404).json({message: 'User not found'}) : res.status(200).json({
            status: 'Success',
            user: user.recordset[0]
        });
     } catch(error){
        res.status(404).json({message: err.message});
     } finally{
        sql.close();
     }
}


// update a user
export const updateUser = async(req,res) =>{
    const {id} = req.params;
    try{
        const { name , email , password } = req.body;
        let pool = await sql.connect(config.sql);
        let updateUser = await pool.request()
        .input('id',sql.Int,id)
        .input('name',sql.VarChar,name)
        .input('email',sql.VarChar,email)
        .input('password',sql.VarChar,password)
        .query('UPDATE Users SET name=@name,email=@email,password=@password WHERE id= @id')

        res.status(200).json({
            status:'success',
            message: 'User updated successfully',
            data:updateUser
        })
    } catch(error){
        res.status(404).json({message: error.message});
    }finally{
        sql.close();
    }
}
   

// Delete a user
export const deleteUser = async(req,res) =>{
    const {id} = req.params;
    try{
        let pool = await sql.connect(config.sql);
        await pool.request()
        .input('id',sql.Int,id)
        .query('DELETE FROM Users WHERE id= @id')

        res.status(200).json({
                    status:'success',
                    message: 'User deleted successfully'
                })
            
    } catch (error){
        res.status(404).json({message: error.message});
    } finally{
        sql.close();
    }
}







// Register a User
export const register = async (req,res) =>{
    const {name,password, email} = req.body;
    const hashedPassword = bcrypt.hashSync(password,10);
    try{
        let pool = await sql.connect(config.sql);
        
        // Check if the user already exists
        const existingUser = await pool.request()
        .input('email',sql.VarChar, email)
        .query('SELECT * FROM Users WHERE email= @email');
        if(existingUser.recordset.length > 0){
            return res.status(409).json({message: 'User already exists '});
        }

        // Insert the user
        await pool.request()
        .input('name', sql.VarChar, name)
        .input('email', sql.VarChar, email)
        .input('password', sql.VarChar, hashedPassword)
        .query('INSERT INTO Users (name, email, password) VALUES (@name, @email, @password)');

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error){
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    } finally{
        sql.close();
    }
}

// User Login
export const login = async (req,res) => {
    const {email, password} = req.body;
    try{
        console.log(req.body);

        // Connect the database
        let pool = await sql.connect(config.sql);
        let result = await pool.request()
        .input('email', sql.VarChar, email)
        .query('SELECT * FROM Users WHERE email = @email');
        console.log(result);
        const user = result.recordset[0];
        console.log(user);
        if(!user){
            res.status(401).json({
                status: "Error",
                message: 'Authentication User does not exist'
            })
        } else if(user){
            if(!bcrypt.compareSync(password,user.password)){
                res.status(404).json({
                    status: 'error',
                    message: 'Invalid credentials'
            })
        } else{
            // create a jwt token store 
            let token = `JWT ${jwt.sign(
                {
                    email:user.email,
                username: user.name,
                 user_id: user.id
                }, process.env.SECRET,{expiresIn:process.env.EXPIRY})}`;

            const {id, name,email} = user;
            return res.json({ id: id, name: name, email: email, token: token });
        }
    }
} catch (error) {
    console.error(error);
    res.status(404).json(err);
} finally{
    sql.close(); 
}

}

