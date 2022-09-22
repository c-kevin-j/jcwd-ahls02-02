import { Box, Button, Container, Typography } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_URL } from "../../helper";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginAction } from "../../Redux/Actions/userAction";
import TokenExpiredPage from "./Partials/TokenExpiredPage";
import toast from "react-hot-toast";


const VerificationPage = () => {

    let { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userData, setUserData] = useState();
    const [disableButton, setDisableButton] = useState(false)

    useEffect(() => {
        getData();
    }, [])

    const getData = async () => {
        try {
            let userData = await axios.get(`${API_URL}/users/tokenData`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setUserData(userData.data)
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong, please try again");
        }
    }

    const handleVerify = async () => {
        try {
            setDisableButton(true)
            let verify = await axios.patch(`${API_URL}/users/verify`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            Cookies.set('userToken', verify.data.finalToken, { expires: 1 })
            dispatch(loginAction(verify.data))
            navigate('/', { replace: true })

        } catch (error) {
            setDisableButton(false)
            console.log(error)
            toast.error("Something went wrong, please try again");
        }
    }

    return <div>
        {userData ? userData.token_verification === token ?
            <>
                <Container>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
                        <img src="https://cdni.iconscout.com/illustration/premium/thumb/face-recognition-security-5152134-4309034.png" alt="verification" style={{ width: '30%' }} />
                        <Typography variant='h4' sx={{ mt: 2 }}>You're one step closer</Typography>
                        <Typography variant='p' color='grey.600' sx={{ mt: 1 }}>Hi {userData ? userData.fullName : null}! Please verify your email address by clicking the button below, and you will get full access of the website</Typography>
                        <Button variant='contained' sx={{ mt: 5 }} disabled={disableButton} onClick={handleVerify}>Verify account</Button>
                    </Box >
                </Container>
            </>
            :
            <TokenExpiredPage />
            :
            <TokenExpiredPage />
        }

    </div >
}

export default VerificationPage;