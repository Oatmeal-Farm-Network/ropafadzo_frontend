

 <form  name=form method="post" action="SendEmail.asp">
  <h2><center>Contact Form</center></h2>

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "600">
				<tr> 
                  	<td colspan="4" align="center" width="536" class = "body"> 
                    	</i>
						
 				<INPUT TYPE="hidden" NAME="Fieldname9"  Value = "<%=iSubject%>" size="45">
				<INPUT TYPE="hidden" NAME="custID"  Value = "<%=custID%>" size="45">
                  	</td>
                </tr>

		<tr> 
			<td width="150" height="20" class = "body" align = "right">First Name:</td>
			<td width="450" height="20" class = "body" > 
				<% Fieldname7= Now  * 3.14890 - 7%>
 						<input name="FirstName" size = "40">
				 	(required)</td>
			</td>
		</tr>
		<tr> 
			<td width="150" height="20" class = "body" align = "right">Last Name:</td>
			<td width="450" height="20" class = "body" > 
				<% Fieldname7= Now  * 3.14890 - 7%>
 						<input name="LastName" size = "40">
				 	(required)</td>
			</td>
		</tr>
         	<tr> 
                	<td  height="20" class = "body" align = "right"> City: </td>
                	<td  height="20" class = "body"> 
					<% Fieldname6= Now  * 3.14890 - 6%>
                    		<INPUT TYPE="text" NAME="Fieldname6" size="45">
                	</td>
            	</tr>
            	<tr> 
                	<td  height="20" class = "body" align = "right"> State:  </td>
                	<td  height="20" class = "body">
					<% Fieldname5= Now  * 3.14890 - 5%>
                    		<INPUT TYPE="TEXT" NAME="Fieldname5" size="5">
							
					 &nbsp; &nbsp;Postal Code:  &nbsp;
                				<% Fieldname4 = Now  * 3.14890 - 4%>
                		<INPUT TYPE="TEXT" NAME="Fieldname4" size="5">
                	</td>
            	</tr>
		
            	<tr> 
                	<td height="20" class = "body" align = "right">Email: </td>
                	<td  height="20" class = "body"> 
					<% Fieldname2 = Now  * 3.14890 - 2%>
                    		<INPUT TYPE="TEXT" NAME="Email" size="45">
                    		 (required)</td>
                	</td>
            	</tr>
            	<tr> 
                	<td  height="1"  class = "body" align = "right" valign = "top">Questions / Comments:</td>
					<td class = "body" valign = "top">
						<% Fieldname1 = Now  * 3.14890 - 1%>
                    	<TEXTAREA NAME="Fieldname1" cols="50" rows="10" wrap="file"></textarea>
                    		
                	</td>
            	</tr>

</table>







<table width = "600">
	
<tr>
	<td  align = "center">
		<input type=button value="Submit" onclick="verify();" >
	</form>

		</td>
</tr>
</table>