import { Box, Typography, Container } from '@mui/material';

function Products() {
  return (
    <Container sx={{ mt: 4 }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Products
        </Typography>
        <Typography variant="body1">
          Welcome to the Products page! Here you can showcase your product listings, categories,
          filters, and more. This is a placeholder – replace it with your own content.
        </Typography>
      </Box>
    </Container>
  );
}

export default Products;