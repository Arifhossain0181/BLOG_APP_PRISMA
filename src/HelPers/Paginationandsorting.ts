type IOPtion ={
    page?: number |string;
    limit?: number |string;
    sortBy?: string;
    sortOrder?: string;
}

type IOresult =
{
    page: number;
    pageSize: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
}
const Paginationandsorting = (oPtion: IOPtion) : IOresult => {

    const Page:number = Number(oPtion.page) || 1;
    const PageSize:number = Number(oPtion.limit) || 10;
    const skip:number = (Page - 1) * PageSize;
    const sortBy= oPtion.sortBy || "createdAt";
        const sortOrder= oPtion.sortOrder || "desc";

    return {
        page: Page,
        pageSize: PageSize,
        skip: skip,
        sortBy: sortBy,
        sortOrder: sortOrder
    }

    
}
export default Paginationandsorting;