//BUDGET CONTROLLER
var budgetController = (function(){
    
    var Expanse = function(id, description, value){
        this.id = id ;
        this.description = description ;
        this.value = value ;
        this.percentage = -1;
    };
    
    
    Expanse.prototype.calcPercentage = function(totalIncome) {
          if (totalIncome > 0){
              this.percentage = Math.round((this.value/totalIncome)*100);
            }
          else {
              this.percentage = -1 ;
               }
    };
    
    
    Expanse.prototype.getPercentages = function (){
        return this.percentage;
    };
    
    
    
    var Income = function(id, description, value){
        this.id = id ;
        this.description = description ;
        this.value = value ;
    };  
    
    
    
    var calculateTotal = function(type){
        var sum = 0 ; 
        data.allItems[type].forEach(function(cur){
            sum = sum + cur.value;
        });
        data.totals[type] = sum ;
    };
  
    
    
    var data = {
        allItems : {
            inc: [],
            exp: [],
            
            },
        
        totals:{
            exp: 0,
            inc: 0
            },
        
        budget:0,
        percentage:  -1,
    };
    console.log(data);
    
    
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            
            //1.Create new ID 
            if (data.allItems[type].length  > 0) {
            ID = data.allItems[type][data.allItems[type].length -1].id + 1;}// Last ID +1
            else {ID = 0 };
            
            //2. Create new item based on 'inc' or 'exp' type
            if (type === 'exp'){
            newItem = new Expanse(ID, des, val);
                }
            
            else if (type === 'inc') {
            newItem = new Income(ID, des, val);   
                }
            
            //3.Push it into data structure
            data.allItems[type].push(newItem);
            
            //4. Return the new element
            return newItem ;
            
            },
        
        
        
        deleteItem : function (type, id) {
            var ids , index;
            //id = 3
            ids = data.allItems[type].map(function(current) {
                return current.id ;
                });
            
            index = ids.indexOf(id);
            if (index !== -1){
                data.allItems[type].splice(index, 1) ;// Splice used to remove , 1 is used for showing to remove on element in array
                }
            },
        
        
        
        calculateBudget:function() {
            
            //1. calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            //2. calculate the budget: income - exp
            data.budget = data.totals.inc - data.totals.exp;
            
            //3. calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
            data.percentage= Math.round((data.totals.exp / data.totals.inc) * 100) ;
                }
            else { data.percentage = -1}
            },
        
        
        
        calculatePercentages: function() {
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc) ; 
            });
        },
        
        
        getPercentage: function() {
            var allPerc= data.allItems.exp.map (function(cur){ // for storing percentages in an array
                return cur.getPercentages() ;
            });
            return allPerc ;
                                                
                                                
        },
        
        
        
        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage,
                }
            },
        
        testing: function() {console.log(data)},
        
    };
    
      
})();

















// UI CONTROLLER
var UIController =(function(){
    
    var DOMstrings = {
        inputType :'.add__type' ,
        inputDescription: '.add__description',
        inputValue:'.add__value',
        clickBtn : '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container:'.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel:'.budget__title--month'
    };
    
    
    
    var formatNumber= function(num, type){
            num = Math.abs(num) ;
            num = num.toFixed(2);// gives 2 digits after a decimal point
            
            var numSplit = num.split('.');
            
            var int = numSplit[0];
                if (int.length > 3){
                    int = int.substr(0,(int.length - 3))+ ',' + int.substr(int.length-3 , int.length); // input= 1258 , output = 1,258
                }
            var dec = numSplit[1];
            
            return (type === 'exp' ? '-' : '+' ) + ' ' + int + '.'+ dec ;
        };
    
    
    
    var nodeListForEach = function (list,callback) {
                for (var i=0 ; i< list.length; i++){
                    callback(list[i] , i);
                }
            };
    
    
    
    
    return {
        getInput: function(){
            return {
            type: document.querySelector(DOMstrings.inputType).value,
            description : document.querySelector(DOMstrings.inputDescription).value ,
            value : parseFloat(document.querySelector(DOMstrings.inputValue).value), // parseFloat is used to convert string to number
            }
        },
        
        
        
        addListItem: function(obj, type){
            var html, element ;
            
            //1.Create HTML string with placeholder text
            if (type === 'inc') {
            element = DOMstrings.incomeContainer ;
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'}
            
            else if (type ==='exp'){
            element = DOMstrings.expensesContainer ;
             html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'}
            
            //2.Replace the placeholder text with some actual data
            newHtml = html.replace('%id%' , obj.id);
            newHtml = newHtml.replace('%description%' , obj.description);
            newHtml = newHtml.replace('%value%' , formatNumber(obj.value, type) );
            
            
            //3. Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('afterEnd', newHtml);
 
        },
        
        
        
        deleteListItem: function(selectorID){
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
            
        },
        
        
        
        clearFields: function(){
            var fields , fieldsArr ;
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);//convert list to an array
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            
            fieldsArr[0].focus(); // put back focus to description
            
        },
        
        
        
        displayBudget : function (obj) {
            var type ;
            
            obj.budget >= 0 ? type = 'inc' : type = 'exp' ;
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type) ;
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber (obj.totalInc , 'inc' );
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            if (obj.percentage > 0){ 
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%' ;
            }
            else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },
        
        
        
        displayPercentages: function(percentages){ // to enter percentage array into fields array
            
            var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);
            
            nodeListForEach(fields, function (current, index){
                                        if( percentages[index] > 0 ){
                                            current.textContent = percentages[index] + '%';
                                            }
                                        else{
                                            current.textContent = '---' ;
                                            }
                                        });
        },
        
        
        
        displayMonth: function(){
            var now, year, month, months;
            
            now = new Date();
            //var christmas = new Date (25, 12 , 2019);
            
            months = ['January', 'February','March', 'April', 'May', 'June', 'July', 'August', 'September','October', 'November', 'December'];
            
            month = now.getMonth();
            year = now. getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year ;
            
            
            
        },
        
        
        
        changedType: function(){
            
            var fields = document.querySelectorAll(DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            
            nodeListForEach (fields, function(cur){
                                        cur.classList.toggle('red-focus');
                                        }); 
            document.querySelector(DOMstrings.clickBtn).classList.toggle('red');
            
            
        },
        
   
        
        getDOMstrings: function(){
        return DOMstrings ;
        },
        
    }
     
       
})();








    
    
    
    
    
    
    
    

// GLOBAL APP CONTROLLER
var Controller = (function(budgetCtrl , UICtrl){
    
     var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.clickBtn).addEventListener('click', ctrlAddItem);
    
        document.addEventListener('keypress', function(event){
            if (event.keyCode === 13 || event.which === 13 ){
                ctrlAddItem();
                }
        });
         
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
         
        document.querySelector(DOM.inputType).addEventListener('change' , UICtrl.changedType );
        
    };
    
    
    
    var updateBudget = function() {
        
        //1. Calculate the budget
        budgetCtrl.calculateBudget();
        
        //2. Return the budget
        var budget = budgetCtrl.getBudget();
        
        //3. Display the budget on UI
        UICtrl.displayBudget(budget);
        
    };
    
    
    
    var updatepercentages = function (){
        //1. calculate percentages
        budgetCtrl.calculatePercentages();
        
        //2. Read percentages from budget controller
        var percentages = budgetCtrl.getPercentage();
        percentages = percentages.reverse();// to reverse the array
        
        //3. update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
        console.log(percentages);
        
        
    };
    
   
    
    var ctrlAddItem = function(){
        var input , newItem, a;
         
        //1. Get the filled data
        input = UICtrl.getInput();
        
        if (input.description !== "" && input.value !== NaN && input.value > 0) {
            
            //2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            console.log(newItem);

            //3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            //4. Clear the fields
            UICtrl.clearFields();

            //5. Calculate and update Budget
            updateBudget();

            //6. To calculate and update percentages
            updatepercentages();
        }
        
    };
    
    
    
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        
        itemID = (event.target.parentNode.parentNode.parentNode.parentNode.id);
        
        if (itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            //1.Delete the item from Data structure
            budgetCtrl.deleteItem(type,ID);
            
            //2. Delete the item from UI
            UICtrl.deleteListItem(itemID);
            
            //3. Update and show the new budget
            updateBudget();
            
            //4. To calculate and update percentages
            updatepercentages();
            
            return UICtrl.getDOMstrings();
        console.log (document.querySelectorAll(DOMstrings.expensesPercentageLabel));
        }
        
    };
    
    
    
    return {
        init: function(){
            console.log('Application has started');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget:0,
                totalInc: 0,
                totalExp: 0,
                percentage:-1});
            setupEventListeners();
            
            
        }
        
    };
 
    
})(budgetController, UIController) ;

Controller.init();