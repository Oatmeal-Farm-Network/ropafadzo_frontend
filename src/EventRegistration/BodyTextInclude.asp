<% 
sql = "select EventPageLayout.PageName, eventPageLayout2.* from EventPageLayout, EventPageLayout2 where EventPagelayout.PageLayoutID  = EventPageLayout2.PageLayoutID  and EventPageLayout.PageName = '" & Pagename & "' and EventPagelayout.EventID = " & EventID & " order by BlockNum"
'response.write(sql)
	
y = 1	
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
while not rs.eof



TempImage = rs("Image")
TempImageLink = "http://" & rs("ImageLink")
tempHeading = rs("PageHeading")
TempImageCaption = rs("ImageCaption")
TempOrientation = rs("ImageOrientation")
TempPageText = rs("PageText")
TempUpload = rs("Upload")  

%>
<a name="Block<%=y%>"></a>
	<%
	
	if len(TempImageLink) < 10 then
	   target=self
	   TempImageLink = TempImage
	else
		target = "target=blank"
	end if 
	If Len(TempImageCaption) < 2 Then
	TempImageCaption = " "
	End if

str1 = TempImageCaption	
	str2 = "&nbsp;"
	If InStr(str1,str2) > 0 Then
		TempImageCaption= Replace(str1,  str2, " ")
	End If 

	str1 = TempImageCaption	
	str2 = "''"
	If InStr(str1,str2) > 0 Then
		TempImageCaption = replace(str1,  str2, "'")
	End If 



str1 = TempHeading	
	str2 = "&nbsp;"
	If InStr(str1,str2) > 0 Then
		TempHeading= Replace(str1,  str2, " ")
	End If 

	str1 = TempHeading	
	str2 = "''"
	If InStr(str1,str2) > 0 Then
		TempHeading = replace(str1,  str2, "'")
	End If 



str1 = TempHeading
str2 = "''"
If InStr(str1,str2) > 0 Then
	TempHeading= Replace(str1, str2 , "'")
End If 




str1 = TempPageText	
	str2 = "&nbsp;"
	If InStr(str1,str2) > 0 Then
		TempPageText= Replace(str1,  str2, " ")
	End If 

	str1 = TempPageText	
	str2 = "''"
	If InStr(str1,str2) > 0 Then
		TempPageText = replace(str1,  str2, "'")
	End If 






str1 = TempPageText
str2 = "''"
If InStr(str1,str2) > 0 Then
	TempPageText= Replace(str1, str2 , "'")
End If 






	found = false
	If Len(TempImage) > 2 And TempOrientation = "Right" Then 
	found = True %> 		
<table  width = "<%=bodywidth -50 %>" border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" align = "center">
	<tr>
		<td class = "body" valign = "top">
		<h3><%=TempHeading%></h3>
		<%=TempPageText %><br>
				<%  if len(TempUpload) > 2 then %>
				<br><table border="0"  cellspacing="0" cellpadding="0" align = "center" >
     		 	<tr>
       				<td background = "images/OverviewBackground.jpg" width = "150" height = "34" class = "Overview" align = "center"><a href = "<%=TempUpload%>" class = "Overview" target = "blank">DOWNLOAD NOW</a></td>
   				</table>
   				<% end if %>

		</td>
		<td  class = "body" valign = "top">
			<table cellpadding = "0" cellpadding = "0" width = "280"><tr><td class = "body" valign = "top"><a href = "<%=TempImageLink%>" <%=target %>><img src = "<%=TempImage%>"  width = "280" border = "0" align = "right" alt = "<%=EventName %> <%=PageName %>" class="special"></a></td></tr>
			<tr><td class = "body">
			<%=TempImageCaption%>
			</td>
			</tr>
			</table>
			</td>
		</tr>
</table>
			<% End If  %>
				<% If Len(TempImage) > 2 And TempOrientation = "Top" Then 
				found = True%> 		
					<table  width = "<%=bodywidth -50 %>" border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" align = "center">
							<tr>
								<td class = "body" valign = "top"><table  width = "280" border="1" bordercolor = "black" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" align = "<%=TempOrientation%>"><tr><td align = "left" valign = "top"><% if len(TempImageLink) > 1 then %><a href = "<%=TempImageLink%>" ><img src = "<%=TempImage%>" width = "<%=bodywidth -50 %>" border = "0" align = "right" alt = "<%=EventName %> <%=PageName %>""></a><% else %><img src = "<%=TempImage%>" width = "<%=bodywidth -50 %>" border = "0" align = "right" alt = "<%=EventName %> <%=PageName %>" class="special"><% end if %></td></tr><tr><td align = "center" class = "body"><%=TempImageCaption%></td></tr></table>
								<h3><%=TempHeading%></h3>
								<%=TempPageText %>
											<%  if len(TempUpload) > 2 then %>
				<br><table border="0"  cellspacing="0" cellpadding="0" align = "center" >
     		 	<tr>
       				<td background = "images/OverviewBackground.jpg" width = "150" height = "34" class = "Overview" align = "center"><a href = "<%=TempUpload%>" class = "Overview" target = "blank">DOWNLOAD NOW</a></td>
   				</table>
   				<% end if %>

								</td>
							</tr>
						</table>
			<% End If  %>
		<% If Len(TempImage) > 2 And TempOrientation = "Left" Then 
		found = True%> 		
	<table width = "<%=bodywidth -50 %>" border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" align = "center">
	<tr>
			<td valign = "middle" class = "body">
			<table border = "0"  cellpadding = "0" cellspacing = "0" width = "280"><tr><td>
			<a href = "<%=TempImageLink%>" <%=target %>><img src = "<%=TempImage%>"  width = "280" border = "0" align = "right" alt = "<%=EventName %> Event Registration" class="special"></a>
			</td>
			</tr>			
			<tr><td class = "body">
			<%=TempImageCaption%>
			</td>
			</tr>
			</table>
		</td>

		<td class = "body" valign = "top">
		<h3><%=TempHeading%></h3>
		<%=TempPageText %><br>
				<%  if len(TempUpload) > 2 then %>
				<br><table border="0"  cellspacing="0" cellpadding="0" align = "center" >
     		 	<tr>
       				<td background = "images/OverviewBackground.jpg" width = "150" height = "34" class = "Overview" align = "center"><a href = "<%=TempUpload%>" class = "Overview" target = "blank">DOWNLOAD NOW</a></td>
   				</table>
   				<% end if %>

		</td>
		</tr>
</table>
			<% End If  %>
			<% If Len(TempImage) < 2 Or found = False and (len(TempHeading) > 2 or len(TempPageText)> 2) Then %> 		
					<table  width = "<%=bodywidth -50 %>" border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" align = "center">
							<tr>
								<td class = "body" valign = "top">
								<h3><%=TempHeading%></h3>
								<%=TempPageText %><br>
										<%  if len(TempUpload) > 2 then %>
				<br><table border="0"  cellspacing="0" cellpadding="0" align = "center" >
     		 	<tr>
       				<td background = "images/OverviewBackground.jpg" width = "150" height = "34" class = "Overview" align = "center"><a href = "<%=TempUpload%>" class = "Overview" target = "blank">DOWNLOAD NOW</a></td>
   				</table>
   				<% end if %>

								</td>
							</tr>
						</table>
			<% End If  %>

<% 
y = y + 1
rs.movenext
wend

rs.close %>

