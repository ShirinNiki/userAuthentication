import { useContext } from "react";
import { Context } from "../../context";
import UserRoute from "../../component/routes/UserRoute";
import { Avatar, List, Row, Col } from "antd";

const UserIndex = () => {
  const { state, dispatch } = useContext(Context);
  const { user } = state;
  console.log(user);
  return (
    <UserRoute>
      <h1 className="jumbotron text-center bg-primary square">
        <pre>Dashbard</pre>
      </h1>
      <Row>
        <Col span={12} offset={6} className="my-5">
          {user && (
            <List header={<div>User info</div>} bordered>
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={`images/${user.picture}`} />}
                  title={<span>{user.name}</span>}
                  description={<p>{user.email}</p>}
                />
              </List.Item>
            </List>
          )}
        </Col>
      </Row>
    </UserRoute>
  );
};

export default UserIndex;
