import axios from "axios";
import { setSellerPostsData } from "../store/reducers/post-reducer";
import { setLoading } from './../store/reducers/global-reducer';

const getSellerPostsData = async (dispatch) => {
    dispatch(setLoading({ loading: true }));
    const authInfo = JSON.parse(localStorage.getItem("authInfo"));
    const config = {
        headers: {
            Authorization: `Bearer ${authInfo.token}`,
        },
    };
    await axios.get(`/seller/seller_community/posts/${authInfo.id}`, config)
        .then(response => {
            if (response.data.status) {
                let res = response.data.data;
                dispatch(setSellerPostsData({ SellerPostsData: res }));
            }
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({ loading: false }));
            }, 300);
        });
}

export { getSellerPostsData };