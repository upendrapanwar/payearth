import React from 'react';
import { Link } from 'react-router-dom';

import superRewards from './../../../assets/images/super-rewards.jpg';

const SuperRewardsSec = () => {
    return(
        <section className="super_rewards_sec">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <Link to="#"><img src={superRewards} alt="super-rewards" /></Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SuperRewardsSec;