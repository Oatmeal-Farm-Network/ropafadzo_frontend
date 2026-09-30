<html>

<head>
<!--#Include file="GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= WebSiteName %></title>
<META name="description" content="<%= WebSiteName %>">
<META name="keywords" content="<%=State%> Alpaca Ranch, <%= WebSiteName %>, <%= Slogan %>, Alpaca web development, alpacas, alpaca">
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="style.css">


	<% Subject=request.form("Subject") 
If Len(Subject) < 3 then
	Subject= Request.QueryString("Subject") 
End If

Subject=request.form("Subject") 
If Len(Subject) < 3 then
	Subject= Request.QueryString("Subject") 
End If 
%>


<SCRIPT LANGUAGE="JavaScript">
function verify() {
var themessage = "Please fill out the following fields: \r";
if (document.form.Name.value=="") {
themessage = themessage + " -Name \r";
}
if (document.form.Breed.value=="") {
themessage = themessage + " -Breed \r";
}
if (document.form.Category.value=="") {
themessage = themessage + " -Category \r";
}
//alert if fields are empty and cancel form submit
if (themessage == "Please fill out the following fields: \r") {
document.form.submit();
}
else {
alert(themessage);
return false;
   }
}
//  End -->
</script>



</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<!--#Include file="Header.asp"-->
<a name="top"></a>

<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"    width = "630">
	<tr>
		<td class = "body" valign = "top"  >
		  <%
		  response.write(Subject)
		  If Subject ="For Sale" Then %>
					<h1>Contact Seller
					<img src = "images/underline.jpg" width = "600"></h1>
					<blockquote>Use the form below to contact this seller.</blockquote>
		  <% End If %>
		   <% If Subject ="WantAd" Then %>
					<h1>Contact Buyer
						<img src = "images/underline.jpg" width = "600"></h1>
						<blockquote>Use the form below to contact this buyer.</blockquote>
			<% End If %>
			<% If Subject ="Donation" Then %>
						<h1>Contact Organization
			<img src = "images/underline.jpg" width = "600"></h1>
			<blockquote>Use the form below to contact this Organization.</blockquote>
								<% End If %>
			<% If Subject ="Barter" Then %>
									<h1>Contact Barterer
			<img src = "images/underline.jpg" width = "600"></h1>
			<blockquote>Use the form below to contact this Barterer.</blockquote>
								<% End If %>

		
		
		
		
		
		
		</td>
	</tr>
    <tr>
	    <td class = "body">
		    
		<form  name=form method="post" action="AddanAlpaca2.asp">	
	
	<input name="_recipients" type="hidden" value="johna@The Andresen Group">
    	<input name="_subjectField" type="hidden" value="name">
	<input name="_subject" type="hidden" value=":&nbsp;Contact&nbsp;Us">
    	<input name="_replyToField" type="hidden" value="email">
	<input name="_requiredFields" type="hidden" value= 
		"First_Name,Last_Name,Business_Name,Email">
		
	<table  class = "dataTable" width="550" border="0" align="CENTER" cellpadding="3" height="90%">
		<tr> 
                  	<td colspan="4" align="center" width="536" class = "body"> 
                    		( &quot;*&quot; indicates required field)</i>
							<% Fieldname8= Now  * 3.14890 - 8%>
 				<INPUT TYPE="hidden" NAME="<%=Fieldname8%>" size="45">
                  	</td>
                </tr>
		<tr> 
			<td width="536" colspan="2" align="center" height="24" valign="middle">
            			<H2>Contact WebArtist.biz</H2></td>
		</tr>
		<tr> 
			<td width="100" height="20" class = "body"> Your Name:</td>
			<td width="400" height="20" class = "body" > 
				<% Fieldname7= Now  * 3.14890 - 7%>
 					<input name="Name" size = "40">
				 * </td>
			</td>
		</tr>
         	<tr> 
                	<td width="100" height="20" class = "body"> City: </td>
                	<td width="400" height="20" class = "body"> 
					<% Fieldname6= Now  * 3.14890 - 6%>
                    		<INPUT TYPE="TEXT" NAME="<%=Fieldname6%>" size="45">
                	</td>
            	</tr>
            	<tr> 
                	<td width="100" height="20" class = "body"> State/Province: </td>
                	<td width="400" height="20" class = "body">
					<% Fieldname5= Now  * 3.14890 - 5%>
                    		<INPUT TYPE="TEXT" NAME="<%=Fieldname5%>" size="5">
                	</td>
            	</tr>
            	<tr> 
                	<td width="100" height="20" class = "body"> Postal Code: </td>
                	<td width="400" height="20" class = "body"> 
					<% Fieldname4 = Now  * 3.14890 - 4%>
                		<INPUT TYPE="TEXT" NAME="<%=Fieldname4%>" size="30">
                	</td>
            	</tr>
		<tr> 
                	<td width="100" height="20" class = "body"> Country: </td>
                	<td width="400" height="20" class = "body">
					<% Fieldname3 = Now  * 3.14890 - 3%>
                		<INPUT TYPE="TEXT" NAME="<%=Fieldname3%>" size="30">
                	</td>
            	</tr>
            	<tr> 
                	<td width="100" height="20" class = "body">Email: </td>
                	<td width="400" height="20" class = "body"> 
					<% Fieldname2 = Now  * 3.14890 - 2%>
                    		<INPUT TYPE="TEXT" NAME="<%=Fieldname2%>" size="45">
                    		 </td>
                	</td>
            	</tr>
            	<tr> 
                	<td colspan="2" height="1" width="550" class = "body"> 
						<% Fieldname1 = Now  * 3.14890 - 1%>
                    	<TEXTAREA NAME="<%=Fieldname1%>" cols="60" rows="8" wrap="file">Please enter comments and/or questions here</textarea>
                    		
                	</td>
            	</tr>
            	<tr> 
                	<td align=center colspan="4" width="550" class = "body">    
                    		<input type=button value="Submit" onclick="verify();">
						
							<br>
                	</td>
           	</tr>
	</table>
</form>

                	</td>
           	</tr>
	</table>

<!--#Include file="Footer.asp"-->
</body>
</html>