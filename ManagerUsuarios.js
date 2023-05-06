const fs = require("fs");


class ProductManager {
    constructor(){
        this.products = [];
        this.path = "users.json"
        fs.readFile(this.path, "utf-8", (err, dataStr) => {
            if (err) {
                console.error(err);
            } else {
                const data = JSON.parse(dataStr);
                this.products = data;
            }
        });
    }
    
    addProduct = async (product) => {
        /*
        Formato:
        -ID (Automatico incremental)
        -title: nombre del producto
        -description: descripción del producto
        -price: precio
        -thumbail: ruta de imagen 
        -code: codigo del producto
        -stock: cantidad disponible del producto
        */
        if (product.id) {
            console.error("Can´t add the product due to inconsistent Id");
        } else {
            product.id = this.#generateId()
            this.products.push(product)
            const productStr = JSON.stringify(this.products)
            await fs.promise.writeFileSync(this.path, productStr)
        }
        
    }
    #generateId(){
        let idGenerated = 0
        for (let i = 0; i < this.products.length; i++) { // * Loop through all existing products
            const newId = this.products[i];
            if(newId.id > idGenerated){ // * If the current product's id is greater than or equal to the current id, set the id to one greater than the current product's id
                idGenerated = newId.id;
            }
        }
        return ++idGenerated
    }
    getProduct(){
        return this.products
    }
    getProductById(id){
        const foundId = this.products.find(e => e.id === id) // * Find the product with the specified id
        if(foundId){
            console.log(foundId);
            return foundId
        } else {
            console.error("Not found"); // * If the product isn't found, print an error message
        }
    }
    
    updateProduct= async (productId, product) => {
        const foundId = this.products.find(e => e.id === productId) // * Find the product with the specified id
        if(foundId){
            if(product.id){
                console.error("Can´t add the product due to inconsistent Id");
            } else {
                Object.assign(foundId, product);
                const productStr = JSON.stringify(this.products)
                await fs.promise.writeFileSync(this.path, productStr)
            }
        } else {
            console.error("Not found"); // * If the product isn't found, print an error message
        }
    }
    deleteProduct = async (id) => {
        const validator = this.products.find(e => e.id === id)
        const foundId = this.products.filter(product => product.id !== id);
        if(validator){
            const productStr = JSON.stringify(foundId)
            await fs.promise.writeFileSync(this.path, productStr)
        } else {
            console.error("EROR not found");
        }
        
        
        
    }
}


const productManager = new ProductManager()


console.log(productManager.getProduct()) // ! Return an empty array
productManager.addProduct({title: "producto de prueba", description:"Este es un producto de prueba", price: 200, thumbnail: "Sin imagen", code: "abc123", stock: 25}) // ! Add the product succssefully
productManager.addProduct({title: "producto de prueba2", description:"Este es un producto de prueba2", price: 100, thumbnail: "Sin imagen", code: "abc124", stock: 15}) // ! Add the product succssefully
productManager.addProduct({title: "producto de prueba", description:"Este es un producto de prueba", price: 200, thumbnail: "Sin imagen", code: "abc123", stock: 25, id:2}) // ! Prints an error message due to inconsistent id
console.log(productManager.getProduct()) // ! Return a array with the products
productManager.getProductById(1) // ! Get the first product
productManager.getProductById(5) // ! ERROR NOT FOUND
productManager.updateProduct(1, {title: "CAMBIO"}) // ! Change the title of the first product
productManager.updateProduct(1, {title: "otro titulo", id: 54}) // ! ERROR due trying to change the id
console.log(productManager.getProduct()) // ! Get the products array´s with the first product updated
productManager.deleteProduct(1) // ! Delete the fist
productManager.deleteProduct(6) // ! ERROR NOT FOUND



