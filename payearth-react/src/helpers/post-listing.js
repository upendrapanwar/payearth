import axios from "axios";
import { setPostsData } from "../store/reducers/post-reducer";
import { setLoading } from './../store/reducers/global-reducer';

const getPostsData = async (dispatch) => {
    dispatch(setLoading({ loading: true }));
    const authInfo = JSON.parse(localStorage.getItem("authInfo"));
    await axios.get(`community/front/posts/${authInfo.id}`)
        .then(response => {
            if (response.data.status) {
                let res = response.data.data;
                dispatch(setPostsData({ postsData: res }));
            }
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({ loading: false }));
            }, 300);
        });
}


export { getPostsData };