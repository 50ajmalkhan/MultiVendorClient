import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../components/Layout';
import { getAllCategory, addCategory } from '../../actions';
import Input from '../../components/UI/Input'

const Category = () => {
    const category = useSelector(state => state.category);
    const dispatch = useDispatch();
    const [categoryName, setCategoryName] = useState("");
    const [parentCategoryId, setParentCategoryId] = useState("");
    const [categoryImage, setCategoryImage] = useState("");
    const [show, setShow] = useState(false);
    useEffect(() => {
        dispatch(getAllCategory())
    }, []);
    const handleClose = () => {
        const form = new FormData();
        form.append('name', categoryName);
        form.append('parentId', parentCategoryId);
        form.append('categoryImage', categoryImage);
        console.log(form);
        dispatch(addCategory(form));
        // const cat = {
        //     categoryName,
        //     parentCategoryId,
        //     categoryImage
        // }
        // console.log(cat);

        setShow(false)
    };
    const handleShow = () => setShow(true);

    const renderCategories = (categories) => {
        let myCategories = [];
        for (let category of categories) {
            myCategories.push(
                <li key={category.name}>
                    {category.name}
                    {category.children.length > 0 ? (<ul>{renderCategories(category.children)}</ul>) : null}
                </li>
            );
        }

        return myCategories;

    };
    const createCategoriesList = (categories, option = []) => {
        let myCategories = [];
        for (let category of categories) {
            option.push(
                {
                    value: category._id,
                    name: category.name
                }
            );
            if (category.children.length > 0) {
                createCategoriesList(category.children, option);
            }
        }

        return option;

    };
    const handleCategoryImage = (e) => {
        setCategoryImage(e.target.files[0]);
    }

    return (
        <Layout sidebar>
            <Container>
                <Row>
                    <Col md={12}>
                        <div style={{ display: "flex", justifyContent: 'space-between' }}>
                            <h3>Category</h3>
                            <button onClick={handleShow}>Add</button>
                        </div>

                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <ul>
                            {renderCategories(category.categories)}
                        </ul>
                    </Col>
                </Row>
            </Container>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Input
                        value={categoryName}
                        placeholder={'Category Name'}
                        onChange={(e) => { setCategoryName(e.target.value) }}
                    />
                    <select
                        className="form-control"
                        value={parentCategoryId}
                        onChange={(e) => { setParentCategoryId(e.target.value) }}>
                        <option>
                            select category
                        </option>
                        {
                            createCategoriesList(category.categories).map(option =>
                                <option key={option.value} value={option.value}>{option.name}</option>)
                        }
                    </select>
                    <input type="file" name="categoryImage" onChange={handleCategoryImage} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
          </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
          </Button>
                </Modal.Footer>
            </Modal>
        </Layout>
    );
}

export default Category;