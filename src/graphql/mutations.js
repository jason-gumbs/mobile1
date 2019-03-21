// eslint-disable
// this is an auto generated file. This will be overwritten
import gql from "graphql-tag";

export const createCompany = gql`
  mutation CreateCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      id
      companyname
      email
      phonenumber
      files {
        bucket
        region
        key
      }
      visibility
      resources {
        items {
          id
          name
          product
          address
          location
          owner
          offering
          category
          city
          description
          number
          state
          zip
          content
        }
        nextToken
      }
    }
  }
`;
export const updateCompany = gql`
  mutation UpdateCompany($input: UpdateCompanyInput!) {
    updateCompany(input: $input) {
      id
      companyname
      email
      phonenumber
      files {
        bucket
        region
        key
      }
      visibility
      resources {
        items {
          id
          name
          product
          address
          location
          owner
          offering
          category
          city
          description
          number
          state
          zip
          content
        }
        nextToken
      }
    }
  }
`;
export const deleteCompany = gql`
  mutation DeleteCompany($input: DeleteCompanyInput!) {
    deleteCompany(input: $input) {
      id
      companyname
      email
      phonenumber
      files {
        bucket
        region
        key
      }
      visibility
      resources {
        items {
          id
          name
          product
          address
          location
          owner
          offering
          category
          city
          description
          number
          state
          zip
          content
        }
        nextToken
      }
    }
  }
`;
export const createResource = gql`
  mutation CreateResource($input: CreateResourceInput!) {
    createResource(input: $input) {
      id
      name
      product
      address
      location
      owner
      offering
      category
      city
      description
      number
      state
      zip
      visibility
      file {
        bucket
        region
        key
      }
      content
      comment {
        items {
          id
          content
        }
        nextToken
      }
      company {
        id
        companyname
        email
        phonenumber
        files {
          bucket
          region
          key
        }
      }
    }
  }
`;
export const updateResource = gql`
  mutation UpdateResource($input: UpdateResourceInput!) {
    updateResource(input: $input) {
      id
      name
      product
      address
      location
      owner
      offering
      category
      city
      description
      number
      state
      zip
      visibility
      file {
        bucket
        region
        key
      }
      content
      comment {
        items {
          id
          content
        }
        nextToken
      }
      company {
        id
        companyname
        email
        phonenumber
        files {
          bucket
          region
          key
        }
      }
    }
  }
`;
export const deleteResource = gql`
  mutation DeleteResource($input: DeleteResourceInput!) {
    deleteResource(input: $input) {
      id
      name
      product
      address
      location
      owner
      offering
      category
      city
      description
      number
      state
      zip
      visibility
      file {
        bucket
        region
        key
      }
      content
      comment {
        items {
          id
          content
        }
        nextToken
      }
      company {
        id
        companyname
        email
        phonenumber
        files {
          bucket
          region
          key
        }
      }
    }
  }
`;
export const createComment = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      content
      resource {
        id
        name
        product
        address
        location
        owner
        offering
        category
        city
        description
        number
        state
        zip
        content
      }
    }
  }
`;
export const updateComment = gql`
  mutation UpdateComment($input: UpdateCommentInput!) {
    updateComment(input: $input) {
      id
      content
      resource {
        id
        name
        product
        address
        location
        owner
        offering
        category
        city
        description
        number
        state
        zip
        content
      }
    }
  }
`;
export const deleteComment = gql`
  mutation DeleteComment($input: DeleteCommentInput!) {
    deleteComment(input: $input) {
      id
      content
      resource {
        id
        name
        product
        address
        location
        owner
        offering
        category
        city
        description
        number
        state
        zip
        content
      }
    }
  }
`;
