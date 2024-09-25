import React, { useState } from 'react';
import styled from 'styled-components';

const SearchAndSort = ({ onSearch, onSort, sortOrder, toggleSortOrder }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        onSearch(event.target.value);
    };

    return (
        <Container>
            <SearchInput
                type="text"
                placeholder="Search input"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <SearchButton>🔍</SearchButton>

            <SortSelect onChange={(e) => onSort(e.target.value)}>
                <option value="" disabled hidden>Sort by</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="price">Price</option>
            </SortSelect>
            <ToggleSortButton onClick={toggleSortOrder}>
                {sortOrder === 'asc' ? '⬆️' : '⬇️'}
            </ToggleSortButton>
        </Container>
    );
};

// Styled components
const Container = styled.div`
    display: flex;
    justify-content: space-between;
    margin-left: 10px;
`;

const SearchInput = styled.input`
    flex: 2;
    padding: 10px;
`;

const SearchButton = styled.button`
    padding: 10px;
    margin-right: 10px;
`;

const SortSelect = styled.select`
    flex: 1;
    padding: 10px;
`;

const ToggleSortButton = styled.button`
    padding: 10px;
`;

export default SearchAndSort;