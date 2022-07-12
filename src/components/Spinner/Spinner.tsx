import { Backdrop, CircularProgress } from '@mui/material';
import styled from 'styled-components';

export default function Spinner({ open }: { open: boolean }): JSX.Element {
  return (
    <StyledBackdrop open={open}>
      <CircularProgress color="secondary" size={60} />
    </StyledBackdrop>
  );
}

const StyledBackdrop = styled(Backdrop)`
  z-index: 10;
`;
