const user = {
    
        _id: '1',
        name: 'ren',
        email: 'ren.tanola@gmail.com',
        picture: 'String'
    

    
}

module.exports = {
    Query: {
        me: () => user
    }
}