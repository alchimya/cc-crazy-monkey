//defines a pseudo random number generator
function PRNG(){
    return{
        // Returns a random integer between min (included) and max (included)
        // Using Math.round() will give you a non-uniform distribution!
        newValue:function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    };
}

module.exports=PRNG;