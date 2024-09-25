import React from 'react';
import styled from 'styled-components';

const Sort = ({ onSort, sortOrder, toggleSortOrder }) => {
    return (
        <Container>
            <SortSelect onChange={(e) => onSort(e.target.value)}>
                <option value="" disabled hidden>Sort by</option>
                <option value="date">Date</option>
                <option value="price">Price</option>
            </SortSelect>
            <SortButton onClick={toggleSortOrder}>
                {sortOrder === 'asc' ? '⬆️' : '⬇️'}
            </SortButton>
        </Container>
    );
};

// Styled components
const Container = styled.div`
    display: flex;
    align-items: center;
`;

const SortSelect = styled.select`
    padding: 10px;
    margin-right: 10px;
`;

const SortButton = styled.button`
    padding: 10px;
`;

export default Sort;