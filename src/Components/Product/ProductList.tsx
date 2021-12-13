import { Product as prod } from "../../Interfaces/Product";
import { Category } from "../../Interfaces/Category";

import { useEffect, useState } from "react";
import Modal from "react-modal";

import { DataGrid, GridColTypeDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import MockProductService from "../shared/MockProductService";
import MockCategoryService from "../shared/MockCategoryService";
import { createJsxOpeningFragment } from "typescript";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");

export default function Product() {
  const productService = new MockProductService();
  const categoryService = new MockCategoryService();

  const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const vndPrice: GridColTypeDef = {
    valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
  };

  const renderButton: GridColTypeDef = {
    renderCell: () => <Button startIcon={<DeleteIcon />}></Button>,
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "productName", headerName: "Product name", width: 200 },
    {
      field: "unitPrice",
      headerName: "Unit price",
      width: 200,
      ...vndPrice,
    },
    {
      field: "action",
      headerName: "Action",
      ...renderButton,
    },
  ];

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setIsOpen(false);
  }

  const [category, setCategory] = useState({
    categories: [],
  });

  const [product, setProduct] = useState({
    items: [],
    pageSize: 0,
    isLoaded: false,
  });

  useEffect(() => {
    categoryService.getAll().then((cate) => {
      setCategory({
        categories: cate.data,
      });
    });
    productService.getAll().then((prod) => {
      setProduct({
        items: prod.data,
        pageSize: 5,
        isLoaded: true,
      });
    });
  }, []);

  function handleChange(e: any) {
    setProduct({
      items: product.items,
      pageSize: parseInt(e.target.value),
      isLoaded: true,
    });
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    const product: prod = {
      id: null,
      productName: e.target.elements.productname.value,
      unitPrice: e.target.elements.unitprice.value,
      categoryId: e.target.elements.category.value,
    };
    console.log(product);
/*     productService.add(product).then((res) => {
      console.log(res);
    }); */
  }

  return (
    <Box>
      <Typography variant="h3" noWrap component="div">
        Products
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          size="small"
          variant="contained"
          onClick={openModal}
          endIcon={<AddIcon />}
        >
          Add new
        </Button>
        <FormControl size="small" style={{ marginTop: 10, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-label">Number of items</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={product.pageSize}
            label="Number of items"
            onChange={(event) => handleChange(event)}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={7}>7</MenuItem>
            <MenuItem value={10}>10</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box style={{ height: 400, width: "100%", marginTop: 10 }}>
        <DataGrid
          rows={product.items}
          columns={columns}
          pageSize={product.pageSize}
          rowsPerPageOptions={[product.pageSize]}
        />
      </Box>

      {/* Add product modal */}
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <Box style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">New product</Typography>
          <Button onClick={closeModal} startIcon={<CloseIcon />}></Button>
        </Box>
        <Divider />
        <form id="new-product" onSubmit={(event) => handleSubmit(event)}>
          <Stack spacing={2} direction="row" style={{ marginTop: 20 }}>
            <FormControl>
              <InputLabel htmlFor="product-name">Product name</InputLabel>
              <Input id="product-name" name="productname" />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="unit-price">Unit price</InputLabel>
              <Input type="number" id="unit-price" name="unitprice" />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Choose one"
                name="category"
              >
                {category.categories.map((cat: any, index: any) => (
                  <MenuItem key={index} value={cat.id}>
                    {cat.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </form>
        <Box style={{ textAlign: "right", marginTop: 20 }}>
          <Button type="submit" form="new-product">
            Submit
          </Button>
        </Box>
      </Modal>

      {/* Update product modal */}

      {/* Delete product confirm modal */}
    </Box>
  );
}
