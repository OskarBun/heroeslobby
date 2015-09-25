define(
	["knockout",
     "text!./blue-string-field-tmpl.html"],
	function(ko, 
			blue_string_field_tmpl){
		
        ko.components.register("blue-string-field",{
            template: blue_string_field_tmpl
        });
    } 
);