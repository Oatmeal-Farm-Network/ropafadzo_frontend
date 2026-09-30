<% 
str1 = Description
str2 = vblf
If InStr(str1,str2) > 0 Then
	Description= Replace(str1, str2 , "</br>")
End If  

str1 = Description
str2 = vbtab
If InStr(str1,str2) > 0 Then
	Description= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
End If  

%>

<table border="0" cellspacing="0"  align = "center" >
						<tr>
									<td  class = "Body"  ><br><%=Description %>
									</td>
								  </tr>
						
			</table>
