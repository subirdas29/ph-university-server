import config from "../config"
import { User } from "../modules/user/user.model"

const superUser = {
    id: '0001',
  email: 'subirdas1045@gmail.com',
  password: config.super_admin_password,
  needsPasswordChange: false,
  role: 'superAdmin',
  status: 'in-progress',
  isDeleted: false
}


const seedSuperAdmin = async()=>{

    //when database is connected, we will check is there any user who is super admin

    const isSuperAdminExist = await User.findOne({role:'superAdmin'})
    
    if(!isSuperAdminExist){
        await User.create(superUser) // eta er  call sob somoy database connection er time e auto hbe
    }
}

export default seedSuperAdmin