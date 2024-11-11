import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Card, CardBody, Row } from "reactstrap";
import { FaRegBuilding } from "react-icons/fa";
import { BsQrCodeScan } from "react-icons/bs";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";



export const Dashboard = () => {
    const [companyCount, setCompanyCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [qrCount, setQRCount] = useState(0);

    useEffect(() => {
        fetchCount();
    }, []);

    const fetchCount = async () => {
        try {
            const Company = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/list/CompanyMaster`);
            if (Company) setCompanyCount(Company.length);
            console.log(Company.length)

            const product = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/list/ProductMaster`);
            if (product) setProductCount(product.length);

            const qr = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/list/QRMaster`);
            if (qr) setQRCount(qr.length);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row >
                    <div className="col-md-4">
                        <Card style={{ cursor: "pointer" }}>
                            <CardBody>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <div className="icon" style={{ color: "black", fontSize: "35px" }}>
                                        <FaRegBuilding />
                                    </div>
                                    <div style={{ marginLeft: "auto", fontSize: "1.5rem" }}>
                                        <p>{companyCount}</p>
                                    </div>
                                </div>
                                <div className="card-count">
                                    <h5 className="card-title">Company</h5>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    <div className="col-md-4">
                        <Card style={{ cursor: "pointer" }}>
                            <CardBody>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <div className="icon" style={{ color: "black", fontSize: "35px" }}>
                                    <MdOutlineProductionQuantityLimits />

                                    </div>
                                    <div style={{ marginLeft: "auto", fontSize: "1.5rem" }}>
                                        <p>{productCount}</p>
                                    </div>
                                </div>
                                <div className="card-count">
                                    <h5 className="card-title">Products </h5>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    <div className="col-md-4">
                        <Card style={{ cursor: "pointer" }}>
                            <CardBody>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <div className="icon" style={{ color: "black", fontSize: "35px" }}>
                                    <BsQrCodeScan />

                                    </div>
                                    <div style={{ marginLeft: "auto", fontSize: "1.5rem" }}>
                                        <p>{qrCount}</p>
                                    </div>
                                </div>
                                <div className="card-count">
                                    <h5 className="card-title">QR Codes </h5>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};
