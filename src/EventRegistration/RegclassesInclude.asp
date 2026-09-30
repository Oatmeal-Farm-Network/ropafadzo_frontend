<%sql = "select * from Services where ServiceTypeLookupID = 5 and EventID =  " & EventID & " Order by ServicesID Desc"
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then
	FeePerAnimal = rs("Price")
	FeePerPen  =  rs("Price2")
	MaxQTY2 =  rs("ServiceMaxQuantity")
	if len(MaxQTY2) > 0 then
	  MaxQTY = "checked"
	end if

	StopDate1 =  rs("ServiceEndDate")
	if len(StopDate1) > 0 then
	  StopDate = "checked"
	end if
	Description =  rs("Description")


str1 = Description
str2 = "</br>"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1, str2 , vbCrLf)
	
End If  


str1 = Description
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1,  str2, " ")
End If 

str1 = Description
str2 = "''"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1,  str2, "'")
End If 

	
End If 


%>

<form  name=halterform method="post" action="RegManageHome.asp?EventID=<%=EventID%>&UpdateHalter=True">
 <table border = "5" bordercolor = "#DBF5F3" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "900" align = "center" >
 <tbody>
	<tr>
	   <td  valign = "top" align = "center"  bgcolor = "#DBF5F3" colspan = "2"><h2>Classes</h2></td>
	</tr>
	<tr>
	  <td>
	  <table >
	  
	  <tr>
		<td class = "body2" align = "right" colspan = "4" >Is there a last date that people can sign up for classes? <input type="checkbox" name="StopDate" id="StopDate" rel="StopDate" <%=StopDate%> >
		</td>
	</tr>
 <tr>
 <td>
   <table>
        
 
 
 
 
	<tr rel="StopDate">
	    <td>&nbsp;</td>
		<td class="body2" colspan = "3"><label for="StopDate"><span class="accessibility"></span>Date: 
		
			<!-- calendar attaches to existing form element -->
	<input type="text" name="StopDate1" value = "<%=StopDate1%>">
	<script language="JavaScript">
	new tcal ({
		// form name
		'formname': 'halterform',
		// input name
		'controlname': 'StopDate1'
	});

</script>
		
		
		</label>
		
		</td>
	</tr>
	  
	  
	  
	    <tr>
	      <td class = "body2" align = "right" width = "300">Price per Attendee: </td>
	      <td class = "body" colspan = "3">$<input class="positive" type="text" name = "FeePerAnimal" size = 7 maxsize = 9 value = "<%=FeePerAttendee%>">
		
	
	<script type="text/javascript">
	
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	
	</script>

	
	      </td>
	    </tr>
	   
	<tr>
		<td class = "body2" align = "right" >Limit Quantity? </td>
		<td class = "body2" colspan = "3"><input type="checkbox" name="MaxQTY" id="MaxQTY" rel="MaxQTY" <%=MaxQTY%> >
	
		</td>
	</tr>
 
	<tr rel="MaxQTY">
	    <td>&nbsp;</td>
		<td class="body2" colspan = "3"><label for="MaxQTY"><span class="accessibility"></span> Maximum Quantity: </label><input name="MaxQTY2" id="MaxQTY" class="integer" type="text" size = "6" value = "<%=MaxQTY2%>">
		
	
	<script type="text/javascript">
	$(".numeric").numeric();
	$(".integer").numeric(false, function() { alert("Integers only"); this.value = ""; this.focus(); });
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	$(".positive-integer").numeric({ decimal: false, negative: false }, function() { alert("Positive integers only"); this.value = ""; this.focus(); });
	$("#remove").click(
		function(e)
		{
			e.preventDefault();
			$(".numeric,.integer,.positive").removeNumeric();
		}
	);
	</script>
	
		
		
		
		
		</td>
	</tr>
 
 	
<tr>
<td class = "body2" align = "right" valign = "top">Description:
   <td class = "body" colspan = "3">
	  <textarea name="Description" cols="60" rows="6" wrap="VIRTUAL" ><%= Description%></textarea>  
	  
	 
	  </td>
	</tr>
	<tr>
	<td align = "center" colspan = "4">
	<input type = "hidden"  name ="EventID"  value ="<%=EventID%>">
	<input type = "hidden"  name ="EventSubTypeID"  value ="<%=EventSubTypeID%>">
	<input type="submit"  value="Update"  ><br>
    	</td>
	</tr>
</table>
</td>
	</tr>
</table>

  </tbody>
</table>
</form>
