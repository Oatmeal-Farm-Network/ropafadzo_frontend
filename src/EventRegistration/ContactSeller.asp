<form  name=form method="post" action="SendEmail.asp">
<table border = "0" bordercolor = "antiquewhite" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=2 cellspacing=5 width = "600" >
	<% message = request.QueryString("message")
   	'response.write("message = " & message & "</br>")
   		if len(message) > 1 then %>
   		<tr>
   			<td align="center" class = "Body2" colspan="2"><font color="red"><B><%=message%></B></font></td>
   		</tr>
  		 <% end if %>
	<tr> 
             <td colspan="2" align="center" width="536" class = "Body2"> 
               		( &quot;*&quot; indicates required field)
						
 				<INPUT TYPE="hidden" NAME="Fieldname9"  Value = "<%=iSubject%> " size="45"> 
				<INPUT TYPE="hidden" NAME="Fieldname8"  Value = "<%=iUID%>" size="45"> 
        </td>
     	</tr> 

		<tr>
			<td width="150" height="20" class = "Body2" align = "right">First Name:*</td>
			<td width="450" height="20" class = "Body2" ><input name="FirstName" value= "<%=session("CUFirstName")%>" size = "45"></td>
		</tr>
		<tr> 
			<td width="150" height="20" class = "Body2" align = "right">Last Name:*</td>
			<td width="450" height="20" class = "Body2" > <input name="LastName"  value= "<%=session("CULastName")%>" size = "45"></td>
		</tr>
		
        <tr> 
            <td  height="20" class = "Body2" align = "right"> Address: </td>
            <td  height="20" class = "Body2"> <input name="Address"  value= "<%=session("CUAddress")%>" size="45"></td>
        </tr>
        <tr> 
            <td  height="20" class = "Body2" align = "right"> Apt/Suite: </td>
            <td  height="20" class = "Body2"> <input name="Apt"  value= "<%=session("CUApt")%>" size="15"></td>
        </tr>

         <tr> 
            <td  height="20" class = "Body2" align = "right"> City: </td>
            <td  height="20" class = "Body2"> <input name="City"  value= "<%=session("CUCity")%>" size="45"></td>
        </tr>
        <tr>
			<td  align = "right" class = "body2"> State/Provence: </td>
			<td  align = "left" valign = "top" class = "body2">
				<select size="1" name="State">
				<% If Len(session("CUState")) > 0 then%>
					<option value="<%=session("CUState")%>" selected><%=session("CUState")%></option>
				<% Else %>
					<option value="" selected>-----</option>
				<% End If %>
					<option value="AL">AL</option>
					<option  value="AK">AK</option>
					<option  value="AZ">AZ</option>
					<option  value="AR">AR</option>
					<option  value="CA">CA</option>
					<option  value="CO">CO</option>
					<option  value="CT">CT</option>
					<option  value="DE">DE</option>
					<option  value="DC">DC</option>
					<option  value="FL">FL</option>
					<option  value="GA">GA</option>
					<option  value="HI">HI</option>
					<option  value="ID">ID</option>
					<option  value="IL">IL</option>
					<option  value="IN">IN</option>
					<option  value="IA">IA</option>
					<option  value="KS">KS</option>
					<option  value="KY">KY</option>
					<option  value="LA">LA</option>
					<option  value="ME">ME</option>
					<option  value="MD">MD</option>
					<option  value="MA">MA</option>
					<option  value="MI">MI</option>
					<option  value="MN">MN</option>
					<option  value="MS">MS</option>
					<option  value="MO">MO</option>
					<option  value="MT">MT</option>
					<option  value="NE">NE</option>
					<option  value="NV">NV</option>
					<option  value="NH">NH</option>
					<option  value="NJ">NJ</option>
					<option  value="NM">NM</option>
					<option  value="NY">NY</option>
					<option  value="NC">NC</option>
					<option  value="ND">ND</option>
					<option  value="OH">OH</option>
					<option  value="OK">OK</option>
					<option  value="OR">OR</option>
					<option  value="PA">PA</option>
					<option  value="RI">RI</option>
					<option  value="SC">SC</option>
					<option  value="SD">SD</option>
					<option  value="TN">TN</option>
					<option  value="TX">TX</option>
					<option  value="UT">UT</option>
					<option  value="VT">VT</option>
					<option  value="VA">VA</option>
					<option  value="WA">WA</option>
					<option  value="WV">WV</option>
					<option  value="WI">WI</option>
					<option  value="WY">WY</option>
					<option  value=""></option>
					<option  value="ON">ON</option>
					<option  value="QC">QC</option>
					<option  value="BC">BC</option>
					<option  value="AB">AB</option>
					<option  value="MB">MB</option>
					<option  value="SK">SK</option>
					<option  value="NS">NS</option>
					<option  value="NB">NB</option>
					<option  value="NL">NL</option>
					<option  value="PE">PE</option>
					<option  value="NT">NT</option>
					<option  value="YK">YK</option>
					<option  value="NU">NU</option>
				</select>
			</td>
		</tr>
		<tr>
			<td   class = "body2" align = "right">	Postal Code:  </td>
			<td  align = "left" valign = "top" class = "body2"> <input name="Zip"  value= "<%=session("CUZip")%>" size = "10"></td>
		</tr>
		<tr>
			<td  align = "right" class = "body2">  Country:	</td>
			<td  align = "left" valign = "top" class = "body2">
				<select size="1" name="Country">
					<option value="USA" selected>USA</option>
					<option value="Canada">Canada</option>
				</select>
			</td>
		</tr>
        <tr> 
            <td height="20" class = "Body2" align = "right">Email:*</td>
            <td height="20" class = "Body2"> <INPUT TYPE="TEXT" NAME="Email"  value= "<%=session("CUEmail")%>" size="45"> </td>
        </tr>
        <tr> 
            <td  height="1"  class = "Body2" align = "right" valign = "top">Questions:</td>
			<td class = "Body2" valign = "top"><TEXTAREA NAME="Questions" cols="50" rows="10" wrap="file"><%=session("CUComments")%></textarea></td>
        </tr>
        <tr> 
            <td  height="1"  class = "Body2" align = "right" valign = "top">How did you hear about Andresen Events? </td>
			<td class = "Body2" valign = "top"><TEXTAREA NAME="Referral" cols="50" rows="5" wrap="file"><%=session("CUReferral")%></textarea></td>
        </tr>

		<tr>
            <td class = "body2" colspan = "2">
            	<b>Math Question</b>
            	  Please answer the simple question below so we know that you are a human being and not a spambot. *
            </td>
        </tr> 
		<tr> 
            <td height="20" class = "Body2" align = "right"><img src = "/images/Mathquestion.jpg"></td>
            <td  height="20" class = "Body2"><INPUT TYPE="TEXT" NAME="fieldX" size="3"></td>
        </tr>

		<tr>
			<td  align = "center" colspan = "2">
				<input type=submit value="Submit"  class = "regsubmit2">
			</td>
		</tr>
</table>
</form>