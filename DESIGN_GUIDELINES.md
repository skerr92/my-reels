# MyReels Design Guidelines

The purpose of this document is to defined the minimum design standards for this project. While Python is not inherently an object oriented languaged, the priciples of OOD/OOP (Object-Oriented Design/Object-Oriented Programming) can improve readability, scalability, and debug-ability of code. That is what we are seeking to accomplish here.

### Overall Structure ###

**New vs Expanded Functionality**

When designing new functionality, we need to consider whether it builds upon existing functionality or if it is new functionality. Knowing what we are contributing will guide how we approach additions to the codebase.

**Expanded Functionality**

When adding to existing functionality, it is better to create new methods(functions) to an existing class. For instance, if we have an existing class that encompases an apple, we might want to add functionality that gives us the nutrient density of the apple object. This expands on the current functionality of the apple class, and the end result of the function is a deeper description of the apple class. 

This would mean we need to add a method/function to the class to ensure we maintain readability. The same would be done if we had a fruit class which was used by subsequent inherited fruit classes.

**New Functionality**

When adding new functionality that is greatly unrelated to other functionality/class descriptions, we want to create a new class to describe the new functionality. For instance, given the apple class above; If we were to add functionality that slices the apple into pieces or transform the apple away from the apple class, we would create a new class description for this new state. 

**Global Variables**

Global variables should be be used when we want to declare something to be constant. Global constants make it easier to describe variables that impact overall functionality. In addition to this, global variables should be in all capital letters and include a single underscore at the beginning and end. 

Example: `_MAX_VALUE_ = const 400000`

**Class Variables**

Class variables should be initialized in the `__init__` class initializer. All class variables should start with an underscore.

Example: `self._name`

**Function Variables**

Variables used in individual functions, or local variables should be descriptive and camel case. It is discouraged to use underscore in between words in local variable names.

Example: `newJobRunTime`

**Functions/Methods**

Functions/methods should be descriptive and snake case. Descriptive names and snake case will improve readability. If a function/method is a single word such as `run`, it should be all lowercase.

Example of snake case function: `def AddNewPart()`

Example of single word function: `def run()`

### HTML/CSS Standards ###

Coming soon!

### Questions? ### 

If you have additional questions about the design and styling guide, please feel free to email hello@oakdev.tech or open an issue.

