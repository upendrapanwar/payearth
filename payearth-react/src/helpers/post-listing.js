import axios from "axios";
import { setPostsData } from "../store/reducers/post-reducer";
import { setLoading } from './../store/reducers/global-reducer';


// const getPostsData = async (dispatch) => {
//     dispatch(setLoading({ loading: true }));
//     const authInfo = JSON.parse(localStorage.getItem("authInfo"));
//     await axios.get(`community/front/posts/${authInfo.id}`)
//         .then(response => {
//             if (response.data.status) {
//                 let res = response.data.data;
//                 dispatch(setPostsData({ postsData: res }));
//             }
//         }).catch(error => {
//             console.log(error);
//         }).finally(() => {
//             setTimeout(() => {
//                 dispatch(setLoading({ loading: false }));
//             }, 300);
//         });
// }


// Test****************************


let previousPostsData = null;

const getPostsData = async (dispatch) => {
    dispatch(setLoading({ loading: true }));
    const authInfo = JSON.parse(localStorage.getItem("authInfo"));

    await axios.get(`community/front/posts/${authInfo.id}`)
        .then(response => {
            if (response.data.status) {
                let newPostsData = response.data.data;

                // Check if the previous data is different from the current data
                if (JSON.stringify(previousPostsData) !== JSON.stringify(newPostsData)) {
                    previousPostsData = newPostsData; // Update previousPostsData to new data
                    dispatch(setPostsData({ postsData: newPostsData })); // Dispatch only if data is different
                }
            }
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({ loading: false }));
            }, 300);
        });
};



export { getPostsData };