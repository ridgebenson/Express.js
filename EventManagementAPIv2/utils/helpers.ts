import { getXataClient } from './../src/xata';

const xata = getXataClient();

type OperationType = 'getMany' | 'filter' | 'update' | 'create' | 'delete';

interface DbOperationParams {
    collection: string;
    filter?: object;
    updateData?: object;
}

export const dbOperation = async (operation: OperationType, params: DbOperationParams) => {
    const { collection, filter, updateData } = params;
    try {
        switch (operation) {
            case 'getMany':
                return await xata.db[collection as keyof typeof xata.db].getMany();
            case 'filter':
                return await xata.db[collection as keyof typeof xata.db].filter(filter).getMany();
            case 'update':
                if (!filter || !updateData) throw new Error('Filter and updateData are required for update operation');
                const itemsToUpdate = await xata.db[collection as keyof typeof xata.db].filter(filter).getMany();
                if (itemsToUpdate.length === 0) throw new Error('No items found to update');
                return await xata.db[collection as keyof typeof xata.db].update(itemsToUpdate[0].id, updateData);
            case 'create':
                if (!updateData) throw new Error('updateData is required for create operation');
                return await xata.db[collection as keyof typeof xata.db].create(updateData);
            case 'delete':
                if (!filter) throw new Error('Filter is required for delete operation');
                const itemsToDelete = await xata.db[collection as keyof typeof xata.db].filter(filter).getMany();
                if (itemsToDelete.length === 0) throw new Error('No items found to delete');
                return await xata.db[collection as keyof typeof xata.db].delete(itemsToDelete[0].id);
            default:
                throw new Error('Invalid operation type');
        }
    } catch (error) {
        console.error(`Error during ${operation} operation:`, error);
        throw error;
    }
};