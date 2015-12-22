class TreeBuilder {

    static buildTree(data:any[], subtotalBys:SubtotalBy[] = [], grandTotal?:SubtotalRow):Tree {
        /*
         * the way we create a Tree is as follows
         * since each detailRow in data can only belong to ONE SubtotalRow and each SubtotalRow can have only 1 parent
         * we take each detailRow, traverse from the root node (i.e. grandTotal) to the given detailRow's theoretical
         * parent SubtotalRow (in other words, find the detailRow's "bucket") and append said detailRow to the parent
         */
        grandTotal = grandTotal || new SubtotalRow("Grand Total");
        grandTotal.setSectorPath([]);
        data.forEach((datum) => this.bucketDetailRow(subtotalBys, new DetailRow(datum), grandTotal));
        return new Tree(grandTotal);
    }

    private static bucketDetailRow(subtotalBys:SubtotalBy[], detailedRow:DetailRow, grandTotal:SubtotalRow):void {
        /*
         * to traverse the grandTotal and find the detailRow's immediate parent SubtotalRow
         * we store the detailRow's sector names in an ordered array
         */
        const sectors:string[] = []; // temporary array of strings to keep track sector names in sequence
        grandTotal.detailRows.push(detailedRow);
        subtotalBys.forEach((subtotalBy) => {
            // the subtotal title
            const bucketTitle = detailedRow.data()[subtotalBy.colTag];
            if (bucketTitle !== undefined) {
                sectors.push(bucketTitle);
                const subtotalRow = TreeBuilder.traverseOrCreate(grandTotal, sectors);
                subtotalRow.detailRows.push(detailedRow);
            }
        });
        detailedRow.setSectorPath(sectors);
    };

    /**
     *
     * @param grandTotal
     * @param sectors
     * @returns {SubtotalRow}
     */
    private static traverseOrCreate(grandTotal:SubtotalRow, sectors:string[]):SubtotalRow {
        // traverse to the correct SubtotalRow
        var currentRow:SubtotalRow = grandTotal;
        for (let k = 0; k < sectors.length; k++) {
            // update the current subtotal row
            if (currentRow.hasChildWithTitle(sectors[k]))
                currentRow = currentRow.getChildByTitle(sectors[k]);
            else {
                // create a new sector if it is not already available
                const newRow = new SubtotalRow(sectors[k]);
                // set the sector path for the new SubtotalRow we just created the length of which determines its depth
                newRow.setSectorPath(sectors.slice(0, k + 1));
                currentRow.addChild(newRow);
                currentRow = newRow;
            }
        }
        return currentRow;
    };

}

class Tree {

    private root:SubtotalRow;

    constructor(root:SubtotalRow) {
        this.root = root;
    }

    getRoot():SubtotalRow {
        return this.root;
    }

}