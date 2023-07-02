import { register,login} from "../controllers/userController.js";
import { getAllUsers,getOneUser,updateUser, deleteUser  } from "../controllers/userController.js";
const userRoutes = (app) => {
// auth routes
app.route('/auth/register')
.post(register)

app.route('/auth/login')
.post(login)

app.route('/users/:id')
.get(getOneUser)
.put(updateUser)
.delete(deleteUser)




app.route('/users')
.get(getAllUsers)
};
export default userRoutes;
