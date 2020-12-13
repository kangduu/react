import React from "react";
import { Button } from "antd";
import HomeChildren from "./HomeChildren";

function Home() {
    return (
        <div>
            <Button type="primary">
                btn
            </Button>
            <HomeChildren text={null} />
        </div>

    )
}
export default Home