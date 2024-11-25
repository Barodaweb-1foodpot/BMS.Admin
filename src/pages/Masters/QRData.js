import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { Container, Row, Col } from 'reactstrap';
import { Puff } from "react-loader-spinner";

export const QRData = () => {

    const { id } = useParams()
    useEffect(() => {
        fetchData()
    }, [id])
    const [data, setData] = useState([])
    const [isLoading, setIsloading] = useState(false)


    const fetchData = async () => {
        try {
            setIsloading(true)
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/get/QRMaster/${id}`)
            if (res.isOk) {
                setData(res.find)
                setIsloading(false)
            }
        }
        catch (error) {
            setIsloading(false)
            console.log(error)
        }
    }

    return (
        <>
            {isLoading && data.length > 0 ? (
                // Loader component while loading
                <div className="loader-container">
                    <Puff
                        color="black"
                        height={50}
                        width={50}
                        timeout={0} // 0 means no timeout, loader will be displayed until setIsLoading(false) is called
                    />
                </div>
            ) : (
                <Container className="mt-5">
                    <div className="border-custom">
                        <div className="content border-custom-dashed p-3">
                            <Row className="mb-4">
                                <h3 className="text-center w-100">{data.productName?.productName}</h3>
                            </Row>

                            <Row>
                                <Col xs="6">
                                    <p>
                                        <span className="fw-bold">Lic No: </span> {data.licenceNo}
                                    </p>
                                </Col>
                                <Col xs="6">
                                    <p>
                                        <span className="fw-bold"> Unique product identification code: </span> {data.productName?.productCode || "-"}
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="6">
                                    <p>
                                        <span className="fw-bold">Name of the API: </span> {data.nameOfAPI}
                                    </p>
                                </Col>
                                <Col xs="6">
                                    <p>
                                        <span className="fw-bold">Brand name: </span> {data.brandName || "-"} Kg
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="6">
                                    <p>
                                        <span className="fw-bold">Batch No: </span> {data.batchNo}
                                    </p>
                                </Col>
                                <Col xs="6">
                                    <p>
                                        <span className="fw-bold">Batch Size </span> {data.batchSize} Kg
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="6">
                                    <p>
                                        <span className="fw-bold">Mfg. Date: </span> {data.DOM} <br />
                                        <span className="fw-bold">(YYYY-MM-DD)</span>
                                    </p>
                                </Col>
                                <Col xs="6">
                                    <p>
                                        <span className="fw-bold">Exp/Retest Date: </span> {data.DOE} <br />
                                        <span className="fw-bold">(YYYY-MM-DD)</span>
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="6">
                                    <p>
                                        <span className="fw-bold">Gross Weight: </span> {data.NW} Kg
                                    </p>
                                </Col>
                                <Col xs="6">
                                    <p>
                                        <span className="fw-bold">Net Weight: </span> {data.NW} Kg
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="6">
                                    <p>
                                        <span className="fw-bold">Tare Weight: </span> {data.TW} Kg
                                    </p>
                                </Col>
                                <Col xs="6">
                                    <p>
                                        <span className="fw-bold">CAS Number : </span> {data.productName?.CASNo} Kg
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12">
                                    <p>
                                        <span className="fw-bold">Storage Condition: </span> {data.productName?.specialsStorageCondition}
                                    </p>
                                </Col>
                            </Row>

                            <Row>
                                <p>
                                    <span className="fw-bold">Serial shipping container code: </span> {data.containerCode}
                                </p>
                            </Row>
                            <Row>
                                <p>
                                    <span className="fw-bold">Manufacturing licence no. or import licence no: </span> {data.licenceNo || "G/25/990"} Kg
                                </p>

                            </Row>

                            <div className="img-footer">
                                <Row className="justify-content-between">
                                    <Col xs="5">
                                        {/* <img src={logoUrl} alt="Logo" style={{ width: '100%' }} /> */}
                                    </Col>
                                     
                                </Row>
                                <div className="mt-3 text-center">
                                    <h5>47/1/16 & 17, GIDC Industrial Estate,<br /> Nandesari - 391340 - India.</h5>
                                </div>
                                <div>
                                    <h6 className="text-right" style={{ fontSize: '10px' }}>Artwork No: BB-001-00</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            )}
        </>
    )
}